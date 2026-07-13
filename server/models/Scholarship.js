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
  category: {
  type: String,
  enum: ["SC/ST", "OBC", "General/Minority", "Female", "All"],
  default: "All",
},
note: String,

  applicationLink: {
    type: String,
    required: [true, 'Please add direct application link url'],
    trim: true,
  },
  // createdAt: {
  //   type: Date,
  //   default: Date.now,
  // },
});

module.exports = mongoose.model('Scholarship', ScholarshipSchema);


