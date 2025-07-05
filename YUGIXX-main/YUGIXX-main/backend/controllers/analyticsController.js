const Analytics = require('../models/Analytics');
const mongoose = require('mongoose');

exports.getAnalytics = async (req, res) => {
  try {
    const { timeframe = '24h', endpoint } = req.query;
    const userId = req.user.id;

    let timeFilter = new Date();
    switch (timeframe) {
      case '1h':
        timeFilter.setHours(timeFilter.getHours() - 1);
        break;
      case '24h':
        timeFilter.setDate(timeFilter.getDate() - 1);
        break;
      case '7d':
        timeFilter.setDate(timeFilter.getDate() - 7);
        break;
      case '30d':
        timeFilter.setDate(timeFilter.getDate() - 30);
        break;
      default:
        timeFilter.setDate(timeFilter.getDate() - 1);
    }

    const query = {
      userId: mongoose.Types.ObjectId(userId),
      timestamp: { $gte: timeFilter }
    };

    if (endpoint) {
      query['metrics.endpoint'] = endpoint;
    }

    const analytics = await Analytics.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d-%H", date: "$timestamp" }
          },
          avgResponseTime: { $avg: "$metrics.responseTime" },
          totalRequests: { $sum: 1 },
          successCount: {
            $sum: {
              $cond: [
                { $and: [
                  { $gte: ["$metrics.statusCode", 200] },
                  { $lt: ["$metrics.statusCode", 300] }
                ]},
                1,
                0
              ]
            }
          },
          errorCount: {
            $sum: {
              $cond: [
                { $or: [
                  { $lt: ["$metrics.statusCode", 200] },
                  { $gte: ["$metrics.statusCode", 300] }
                ]},
                1,
                0
              ]
            }
          },
          avgTTFB: { $avg: "$performance.ttfb" },
          endpoints: { 
            $addToSet: "$metrics.endpoint"
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get endpoint-specific stats
    const endpointStats = await Analytics.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$metrics.endpoint",
          avgResponseTime: { $avg: "$metrics.responseTime" },
          totalRequests: { $sum: 1 },
          successRate: {
            $avg: {
              $cond: [
                { $and: [
                  { $gte: ["$metrics.statusCode", 200] },
                  { $lt: ["$metrics.statusCode", 300] }
                ]},
                1,
                0
              ]
            }
          }
        }
      },
      { $sort: { totalRequests: -1 } }
    ]);

    // Get error distribution
    const errorDistribution = await Analytics.aggregate([
      { $match: { ...query, 'errors.code': { $exists: true } } },
      {
        $group: {
          _id: "$errors.code",
          count: { $sum: 1 },
          messages: { $addToSet: "$errors.message" }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        timeseriesData: analytics,
        endpointStats,
        errorDistribution
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getMonitoring = async (req, res) => {
  try {
    const userId = req.user.id;
    const lastHour = new Date();
    lastHour.setHours(lastHour.getHours() - 1);

    const realtimeStats = await Analytics.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId(userId),
          timestamp: { $gte: lastHour }
        }
      },
      {
        $group: {
          _id: {
            minute: { $minute: "$timestamp" },
            hour: { $hour: "$timestamp" }
          },
          avgResponseTime: { $avg: "$metrics.responseTime" },
          requestCount: { $sum: 1 },
          errorCount: {
            $sum: {
              $cond: [
                { $or: [
                  { $lt: ["$metrics.statusCode", 200] },
                  { $gte: ["$metrics.statusCode", 300] }
                ]},
                1,
                0
              ]
            }
          },
          performance: {
            avgTTFB: { $avg: "$performance.ttfb" },
            avgTotalTime: { $avg: "$performance.totalTime" }
          }
        }
      },
      { $sort: { "_id.hour": 1, "_id.minute": 1 } }
    ]);

    // Get current system status
    const currentStatus = await Analytics.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId(userId),
          timestamp: { $gte: lastHour }
        }
      },
      {
        $group: {
          _id: null,
          totalRequests: { $sum: 1 },
          avgResponseTime: { $avg: "$metrics.responseTime" },
          errorRate: {
            $avg: {
              $cond: [
                { $or: [
                  { $lt: ["$metrics.statusCode", 200] },
                  { $gte: ["$metrics.statusCode", 300] }
                ]},
                1,
                0
              ]
            }
          },
          availability: {
            $avg: {
              $cond: [
                { $and: [
                  { $gte: ["$metrics.statusCode", 200] },
                  { $lt: ["$metrics.statusCode", 300] }
                ]},
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        realtimeStats,
        currentStatus: currentStatus[0] || {
          totalRequests: 0,
          avgResponseTime: 0,
          errorRate: 0,
          availability: 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}; 