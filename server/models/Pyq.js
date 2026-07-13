// const mongoose = require("mongoose");

// const PYQSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   subject: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Subject",
//     required: true,
//   },
//   semester: {
//     type: Number,
//     required: true,
//   },
//   year: {
//   type: String,
//   required: true,
// },
// fileId: {
//   type: String,
//   required: true,
//   unique: true
// },
// fileUrl: {
//   type: String,
//   required: true
// },
//   uploadedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model("PYQ", PYQSchema);




// models/Pyq.js
const mongoose = require("mongoose");

const PYQSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true },
    publicId:    { type: String, required: true, unique: true },
    fileUrl:     { type: String, required: true },
   subjectCode: { type: String, default: "UNKNOWN" },
   subject: {
   type: mongoose.Schema.Types.ObjectId,
   ref: "Subject",
   },
    semester: {
  type: String,
  default: null,
},

year: {
  type: String,
  default: null,
},
    uniqueKey: {
  type: String,
  required: true,
  unique: true,
  index: true,
},
    source:      { type: String, default: "cloudinary" },
  },
  { timestamps: true }
);

// ❌ REMOVED: semantic_unique on {subjectCode, semester, year}
//    It incorrectly collapsed papers with different subject codes.
//    uniqueKey (semester_subjectCode_year) handles semantic dedup correctly.
PYQSchema.index(
  { uniqueKey: 1 },
  {
    unique: true,
    name: "unique_key_index",
  }
);
module.exports = mongoose.model("PYQ", PYQSchema);