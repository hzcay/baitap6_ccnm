const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const redisClient = require('../redisClient');
const { authMiddleware } = require('../middlewares/auth.middleware');

const isPast30Minutes = (createdAt) => {
  const thirtyMins = 30 * 60 * 1000;
  return (Date.now() - new Date(createdAt).getTime()) > thirtyMins;
};

router.use(authMiddleware);

// Create a new order (Checkout)
router.post('/', async (req, res) => {
  try {
    const { items, totalAmount, shippingDetails, paymentMethod } = req.body;
    const userId = req.user.id;
    
    if (paymentMethod !== 'COD') {
      return res.status(400).json({ error: 'Only COD payment method is supported.' });
    }

    const order = new Order({
      userId,
      items,
      totalAmount,
      shippingDetails,
      paymentMethod,
      status: 'New'
    });

    await order.save();
    
    // Clear the cart after successful order
    await redisClient.del(`cart:${userId}`);

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user orders (History) with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const total = await Order.countDocuments({ userId: req.user.id });
    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    res.json({
      data: orders,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Order Status (Admin or User canceling)
router.patch('/:orderId/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.orderId);
    
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // Cancellation logic
    if (status === 'Canceled') {
      if (isPast30Minutes(order.createdAt)) {
        return res.status(400).json({ error: 'Cannot cancel order after 30 minutes' });
      }
      if (order.status === 'Preparing' || order.status === 'Shipping' || order.status === 'Delivered') {
         // If it's already preparing, change to cancel requested instead
         if (order.status === 'Preparing') {
            order.status = 'Cancel Requested';
            await order.save();
            return res.json({ message: 'Order is being prepared. Sent cancellation request to shop.', order });
         }
         return res.status(400).json({ error: 'Cannot cancel order at this stage' });
      }
    }

    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
