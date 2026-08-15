const PYQ = require("../models/PYQ");
const PYQ_MAPPING = require("../config/pyqMapping");

/**
 * Get valid PYQs for a semester.
 *
 * MongoDB data is NOT modified.
 * We only return papers that are present in our mapping.
 */
const getValidPYQs = async (semester, extraFilter = {}) => {
  const semesterMapping = PYQ_MAPPING[String(semester)];

  if (!semesterMapping) {
    return [];
  }

  const validDbYears = Object.keys(semesterMapping);

  if (validDbYears.length === 0) {
    return [];
  }

  const query = {
    semester: String(semester),
    year: { $in: validDbYears },
    ...extraFilter,
  };

  const pyqs = await PYQ.find(query)
    .populate("subject")
    .sort({ year: -1 });

  // Add the actual academic/display year
  return pyqs.map((pyq) => ({
    ...pyq.toObject(),

    academicYear:
      semesterMapping[pyq.year] || pyq.year,
  }));
};

module.exports = {
  getValidPYQs,
};