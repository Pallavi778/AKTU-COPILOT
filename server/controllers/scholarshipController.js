const Scholarship = require('../models/Scholarship');

// @desc    Get all scholarships (with eligibility or search filter)
// @route   GET /api/scholarships
// @access  Public
exports.getScholarships = async (req, res) => {
  try {
    const { eligibility, search } = req.query;
    const filter = {};

    if (eligibility && eligibility !== 'All') {
      filter.eligibility = { $regex: eligibility, $options: 'i' };
    }
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const scholarships = await Scholarship.find(filter).sort({ lastDate: 1 });
    res.json({ success: true, count: scholarships.length, data: scholarships });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new scholarship
// @route   POST /api/scholarships
// @access  Private
exports.createScholarship = async (req, res) => {
  try {
    const { title, eligibility, lastDate, applicationLink } = req.body;

    const scholarship = await Scholarship.create({
      title,
      eligibility,
      lastDate: new Date(lastDate),
      applicationLink,
    });

    res.status(201).json({ success: true, data: scholarship });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
