const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  branch: {
    type: String,
    default: "Common",
  },
});

module.exports = mongoose.model("Subject", SubjectSchema);