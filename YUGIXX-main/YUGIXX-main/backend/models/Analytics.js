const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  metrics: {
    responseTime: {
      type: Number,
      required: true
    },
    statusCode: {
      type: Number,
      required: true
    },
    endpoint: {
      type: String,
      required: true
    },
    method: {
      type: String,
      required: true
    }
  },
  performance: {
    ttfb: Number,  // Time to First Byte
    totalTime: Number,
    dnsTime: Number,
    connectTime: Number
  },
  errors: {
    count: {
      type: Number,
      default: 0
    },
    message: String,
    code: String
  }
});

analyticsSchema.index({ userId: 1, timestamp: -1 });
analyticsSchema.index({ 'metrics.endpoint': 1 });

module.exports = mongoose.model('Analytics', analyticsSchema); 