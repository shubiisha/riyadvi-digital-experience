const JobApplication = require('../models/JobApplication');
const emailService = require('../services/emailService');
const uploadService = require('../services/uploadService');
const asyncHandler = require('../utils/asyncHandler');

const submitApplication = asyncHandler(async (req, res) => {
  const { name, email, phone, position, experienceYears, portfolioUrl, resumeUrl, coverLetter } = req.body;

  const processedResume = uploadService.processResume(resumeUrl, name);

  const application = await JobApplication.create({
    name,
    email,
    phone,
    position,
    experienceYears,
    portfolioUrl,
    resumeUrl: processedResume.url,
    coverLetter,
    status: 'Applied',
  });

  await emailService.sendApplicationNotification(application);

  res.status(201).json({
    success: true,
    message: `Thank you, ${name}! Your application for '${position}' has been received. Our talent team will review your profile shortly.`,
    data: application,
  });
});

const getApplications = asyncHandler(async (req, res) => {
  const items = await JobApplication.find();
  res.status(200).json({
    success: true,
    count: items.length,
    data: items,
  });
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const updated = await JobApplication.findByIdAndUpdate(id, { status }, { new: true });
  res.status(200).json({
    success: true,
    data: updated,
  });
});

module.exports = {
  submitApplication,
  getApplications,
  updateApplicationStatus,
};
