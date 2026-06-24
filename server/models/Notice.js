const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a notice title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add description content'],
    trim: true,
  },
  publishDate: {
    type: Date,
    required: [true, 'Please specify notice publication date'],
    default: Date.now,
  },
  link: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Notice', NoticeSchema);
