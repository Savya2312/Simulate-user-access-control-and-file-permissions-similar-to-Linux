const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  username: String,
  action: {
    type: String,
    required: true
  },
  target: String,
  status: {
    type: String,
    enum: ['success', 'denied', 'error'],
    default: 'success'
  },
  details: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Log', LogSchema);
