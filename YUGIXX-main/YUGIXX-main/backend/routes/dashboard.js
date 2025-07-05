const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Protected dashboard route
router.get('/dashboard', auth, (req, res) => {
  try {
    // Return user data (excluding password)
    res.json({
      name: req.user.name,
      email: req.user.email,
      joinedAt: req.user.joinedAt
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 