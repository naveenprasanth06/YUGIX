const ApiTest = require('../models/ApiTest');
const Collection = require('../models/Collection');

exports.createTest = async (req, res) => {
  try {
    const { url, method, headers, params, body, collectionId } = req.body;
    const userId = req.user.id;

    const test = new ApiTest({
      url,
      method,
      headers: new Map(Object.entries(headers || {})),
      params: new Map(Object.entries(params || {})),
      body,
      userId,
      collectionId,
      responseTime: req.responseTime,
      status: req.responseStatus === 'success' ? 'success' : 'error',
      response: {
        status: req.responseStatus,
        data: req.responseData,
        headers: req.responseHeaders
      }
    });

    await test.save();

    res.status(201).json({
      success: true,
      data: test
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getTestHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10, collectionId } = req.query;
    const userId = req.user.id;

    const query = { userId };
    if (collectionId) {
      query.collectionId = collectionId;
    }

    const tests = await ApiTest.find(query)
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('collectionId', 'name');

    const total = await ApiTest.countDocuments(query);

    res.status(200).json({
      success: true,
      data: tests,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getTestById = async (req, res) => {
  try {
    const test = await ApiTest.findById(req.params.id)
      .populate('collectionId', 'name');

    if (!test) {
      return res.status(404).json({
        success: false,
        error: 'Test not found'
      });
    }

    if (test.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this test'
      });
    }

    res.status(200).json({
      success: true,
      data: test
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.deleteTest = async (req, res) => {
  try {
    const test = await ApiTest.findById(req.params.id);

    if (!test) {
      return res.status(404).json({
        success: false,
        error: 'Test not found'
      });
    }

    if (test.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this test'
      });
    }

    await test.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getTestStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await ApiTest.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalTests: { $sum: 1 },
          avgResponseTime: { $avg: '$responseTime' },
          successCount: {
            $sum: { $cond: [{ $eq: ['$status', 'success'] }, 1, 0] }
          },
          errorCount: {
            $sum: { $cond: [{ $eq: ['$status', 'error'] }, 1, 0] }
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: stats[0] || {
        totalTests: 0,
        avgResponseTime: 0,
        successCount: 0,
        errorCount: 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}; 