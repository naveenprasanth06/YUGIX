const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const auth = require('../middleware/auth');

// Get user settings
router.get('/', auth, getSettings);

// Update user settings
router.put('/', auth, updateSettings);

module.exports = router; 