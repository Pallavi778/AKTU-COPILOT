const Notice = require('../models/Notice');

// @desc    Get all university notices (with optional search)
// @route   GET /api/notices
// @access  Public
exports.getNotices = async (req, res) => {
  try {
    const { search } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const notices = await Notice.find(filter).sort({ publishDate: -1 });
    res.json({ success: true, count: notices.length, data: notices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new notice
// @route   POST /api/notices
// @access  Private
exports.createNotice = async (req, res) => {
  try {
    const { title, description, publishDate, link } = req.body;

    const notice = await Notice.create({
      title,
      description,
      publishDate: publishDate ? new Date(publishDate) : new Date(),
      link,
    });

    res.status(201).json({ success: true, data: notice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
