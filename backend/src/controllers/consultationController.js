const Consultation = require('../models/Consultation');
const emailService = require('../services/emailService');
const asyncHandler = require('../utils/asyncHandler');

const bookConsultation = asyncHandler(async (req, res) => {
  const { name, email, phone, company, preferredDate, preferredTime, serviceInterested, budgetRange, projectOverview } = req.body;

  const consultation = await Consultation.create({
    name,
    email,
    phone,
    company,
    preferredDate,
    preferredTime,
    serviceInterested: serviceInterested || 'General Consultation',
    budgetRange,
    projectOverview,
    status: 'Scheduled',
  });

  await emailService.sendConsultationConfirmation(consultation);

  res.status(201).json({
    success: true,
    message: 'Free consultation booked successfully! Check your inbox for the calendar invite.',
    data: consultation,
  });
});

const getConsultations = asyncHandler(async (req, res) => {
  const items = await Consultation.find();
  res.status(200).json({
    success: true,
    count: items.length,
    data: items,
  });
});

module.exports = {
  bookConsultation,
  getConsultations,
};
