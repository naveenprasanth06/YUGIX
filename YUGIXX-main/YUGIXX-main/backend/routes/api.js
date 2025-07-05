const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const apiTestController = require('../controllers/apiTestController');
const settingsController = require('../controllers/settingsController');
const analyticsController = require('../controllers/analyticsController');

// API Test routes
router.post('/tests', protect, apiTestController.createTest);
router.get('/tests', protect, apiTestController.getTestHistory);
router.get('/tests/:id', protect, apiTestController.getTestById);
router.delete('/tests/:id', protect, apiTestController.deleteTest);
router.get('/tests/stats', protect, apiTestController.getTestStats);

// Settings routes
router.get('/settings', protect, settingsController.getUserSettings);
router.put('/settings', protect, settingsController.updateSettings);
router.post('/settings/environments', protect, settingsController.addEnvironment);
router.put('/settings/environments/:id', protect, settingsController.updateEnvironment);
router.delete('/settings/environments/:id', protect, settingsController.deleteEnvironment);

// Analytics routes
router.get('/analytics', protect, analyticsController.getAnalytics);
router.get('/monitoring', protect, analyticsController.getMonitoring);

module.exports = router; 