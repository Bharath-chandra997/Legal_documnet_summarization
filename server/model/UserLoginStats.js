const mongoose = require('mongoose');

const UserLoginStatsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  count: {
    type: Number,
    required: true,
    default: 0
  }
});

module.exports = mongoose.model('UserLoginStats', UserLoginStatsSchema);