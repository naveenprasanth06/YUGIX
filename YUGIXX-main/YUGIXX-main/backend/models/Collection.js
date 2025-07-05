const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  environment: {
    type: Map,
    of: String,
    default: {}
  },
  tests: [{
    name: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    method: {
      type: String,
      required: true,
      enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
    },
    headers: {
      type: Map,
      of: String,
      default: {}
    },
    params: {
      type: Map,
      of: String,
      default: {}
    },
    body: {
      type: String,
      default: ''
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

collectionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

collectionSchema.index({ userId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Collection', collectionSchema); 