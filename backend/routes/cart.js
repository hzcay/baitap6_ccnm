const express = require('express');
const router = express.Router();
const redisClient = require('../redisClient');
const { authMiddleware } = require('../middlewares/auth.middleware');

const getCartKey = (userId) => `cart:${userId}`;

router.use(authMiddleware);

// Get Cart
router.get('/', async (req, res) => {
  try {
    const cart = await redisClient.get(getCartKey(req.user.id));
    res.json(cart ? JSON.parse(cart) : { items: [], total: 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update/Add to Cart
router.post('/', async (req, res) => {
  try {
    const { items, total } = req.body;
    await redisClient.set(getCartKey(req.user.id), JSON.stringify({ items, total }), 'EX', 86400);
    res.json({ message: 'Cart updated successfully', items, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Clear Cart
router.delete('/', async (req, res) => {
  try {
    await redisClient.del(getCartKey(req.user.id));
    res.json({ message: 'Cart cleared successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
