const mongoose = require('mongoose');

const userSettingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  theme: {
    type: String,
    enum: ['light', 'dark'],
    default: 'light'
  },
  defaultHeaders: {
    type: Map,
    of: String,
    default: {}
  },
  environments: [{
    name: {
      type: String,
      required: true
    },
    variables: {
      type: Map,
      of: String,
      default: {}
    }
  }],
  notifications: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    testCompletionAlert: {
      type: Boolean,
      default: true
    },
    errorAlerts: {
      type: Boolean,
      default: true
    }
  },
  autoSave: {
    type: Boolean,
    default: true
  },
  responseFormatting: {
    prettyPrint: {
      type: Boolean,
      default: true
    },
    wrapLines: {
      type: Boolean,
      default: true
    },
    fontSize: {
      type: Number,
      default: 14
    }
  },
  shortcuts: {
    type: Map,
    of: String,
    default: {}
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

userSettingsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('UserSettings', userSettingsSchema); 