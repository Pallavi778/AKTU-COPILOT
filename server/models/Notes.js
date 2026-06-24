const mongoose = require('mongoose');

const NotesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a notes title'],
    trim: true,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: [true, 'Please associate these notes with a subject'],
  },
  semester: {
    type: Number,
    required: [true, 'Please specify the semester'],
  },
  branch: {
    type: String,
    required: [true, 'Please specify the branch'],
  },
  chapter: {
    type: String,
    required: [true, 'Please specify the chapter name or number'],
    trim: true,
  },
  fileUrl: {
    type: String,
    required: [true, 'Please provide the document file path or URL'],
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Notes', NotesSchema);
