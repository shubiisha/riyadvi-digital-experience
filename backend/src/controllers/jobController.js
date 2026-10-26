const Job = require('../models/Job');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const getJobs = asyncHandler(async (req, res) => {
  const { department, designation, experience } = req.query;
  let jobs = await Job.find({ isActive: true });

  if (department && department !== 'All') {
    jobs = jobs.filter((j) => j.department.toLowerCase() === department.toLowerCase());
  }

  if (designation && designation !== 'All') {
    jobs = jobs.filter((j) => j.designation.toLowerCase() === designation.toLowerCase());
  }

  if (experience && experience !== 'All') {
    jobs = jobs.filter((j) => j.experience.toLowerCase().includes(experience.toLowerCase()));
  }

  res.status(200).json({
    success: true,
    count: jobs.length,
    data: jobs,
  });
});

const getJobBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const job = await Job.findOne({ slug });

  if (!job) {
    throw new ApiError(404, `Job opening with slug '${slug}' not found`);
  }

  res.status(200).json({
    success: true,
    data: job,
  });
});

module.exports = {
  getJobs,
  getJobBySlug,
};
