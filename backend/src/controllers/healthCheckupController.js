const HealthCheckup = require('../models/HealthCheckup');
const leadService = require('../services/leadService');
const emailService = require('../services/emailService');
const asyncHandler = require('../utils/asyncHandler');

const submitHealthCheckup = asyncHandler(async (req, res) => {
  const payload = req.body;

  // Calculate digital readiness score & recommendations
  const analysis = leadService.calculateHealthScore(payload);

  const checkup = await HealthCheckup.create({
    ...payload,
    digitalReadinessScore: analysis.digitalReadinessScore,
    readinessLevel: analysis.readinessLevel,
    recommendedServices: analysis.recommendedServices,
    status: 'New',
  });

  await emailService.sendHealthCheckupReport(checkup);

  res.status(201).json({
    success: true,
    message: 'Your Digital Health Checkup diagnostic report has been generated successfully!',
    data: {
      id: checkup._id,
      companyName: checkup.companyName,
      digitalReadinessScore: checkup.digitalReadinessScore,
      readinessLevel: checkup.readinessLevel,
      recommendedServices: checkup.recommendedServices,
      createdAt: checkup.createdAt,
    },
  });
});

const getHealthCheckups = asyncHandler(async (req, res) => {
  const items = await HealthCheckup.find();
  res.status(200).json({
    success: true,
    count: items.length,
    data: items,
  });
});

module.exports = {
  submitHealthCheckup,
  getHealthCheckups,
};
