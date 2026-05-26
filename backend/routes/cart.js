const express = require('express');
const router = express.Router();
const redisClient = require('../redisClient');

// Helper to get cart key for a user (using session or user id, let's assume simple user param for assignment)
const getCartKey = (userId) => `cart:${userId}`;

// Get Cart
router.get('/:userId', async (req, res) => {
  try {
    const cart = await redisClient.get(getCartKey(req.params.userId));
    res.json(cart ? JSON.parse(cart) : { items: [], total: 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update/Add to Cart
router.post('/:userId', async (req, res) => {
  try {
    const { items, total } = req.body;
    // Store cart with 24 hours TTL
    await redisClient.set(getCartKey(req.params.userId), JSON.stringify({ items, total }), 'EX', 86400);
    res.json({ message: 'Cart updated successfully', items, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Clear Cart
router.delete('/:userId', async (req, res) => {
  try {
    await redisClient.del(getCartKey(req.params.userId));
    res.json({ message: 'Cart cleared successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
