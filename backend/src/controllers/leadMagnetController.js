const LeadMagnet = require('../models/LeadMagnet');
const emailService = require('../services/emailService');
const asyncHandler = require('../utils/asyncHandler');

const downloadLeadMagnet = asyncHandler(async (req, res) => {
  const { name, company, email, phone } = req.body;

  const lead = await LeadMagnet.create({
    name,
    company,
    email,
    phone,
    resourceName: 'Riyadvi Software Project Planning Guide 2025',
    downloadLinkSent: true,
    status: 'Active',
  });

  await emailService.sendLeadMagnetLink(lead);

  res.status(201).json({
    success: true,
    message: 'Planning guide unlocked! Your download has started and a copy was sent to your email.',
    data: {
      id: lead._id,
      downloadUrl: '/downloads/Riyadvi_Software_Project_Planning_Guide_2025.pdf',
      resourceName: lead.resourceName,
      deliveredTo: lead.email,
    },
  });
});

const getLeadMagnets = asyncHandler(async (req, res) => {
  const items = await LeadMagnet.find();
  res.status(200).json({
    success: true,
    count: items.length,
    data: items,
  });
});

module.exports = {
  downloadLeadMagnet,
  getLeadMagnets,
};
