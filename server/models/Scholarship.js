const mongoose = require('mongoose');

const ScholarshipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a scholarship title'],
    trim: true,
  },
  eligibility: {
    type: String,
    required: [true, 'Please add eligibility details'],
    trim: true,
  },
  lastDate: {
    type: Date,
    required: [true, 'Please add application deadline date'],
  },
  applicationLink: {
    type: String,
    required: [true, 'Please add direct application link url'],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Scholarship', ScholarshipSchema);
