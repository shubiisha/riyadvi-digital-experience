const ContactEnquiry = require('../models/ContactEnquiry');
const emailService = require('../services/emailService');
const asyncHandler = require('../utils/asyncHandler');

const submitContact = asyncHandler(async (req, res) => {
  const { name, email, phone, company, requirement, message } = req.body;

  const enquiry = await ContactEnquiry.create({
    name,
    email,
    phone,
    company,
    requirement,
    message,
    status: 'New',
  });

  // Trigger simulated email notification
  await emailService.sendContactNotification(enquiry);

  res.status(201).json({
    success: true,
    message: 'Thank you for reaching out to Riyadvi Software Technologies! Our solutions architect will connect within 24 hours.',
    data: {
      id: enquiry._id,
      name: enquiry.name,
      email: enquiry.email,
      createdAt: enquiry.createdAt,
    },
  });
});

const getContacts = asyncHandler(async (req, res) => {
  const enquiries = await ContactEnquiry.find();
  res.status(200).json({
    success: true,
    count: enquiries.length,
    data: enquiries,
  });
});

module.exports = {
  submitContact,
  getContacts,
};
