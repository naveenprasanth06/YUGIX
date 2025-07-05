  // models/Setting.js
  const mongoose = require('mongoose');

  const settingSchema = new mongoose.Schema({
      userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: [true, 'User ID is required'],
      },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    notifications: {
      type: Boolean,
      default: true
    },
    autoSave: {
      type: Boolean,
      default: true
    },
    timeout: {
      type: Number,
      default: 30000
    }
  }, { timestamps: true });

  const Setting = mongoose.model('Setting', settingSchema);

  module.exports = Setting;
