const ContactEnquiry = require('../models/ContactEnquiry');
const Consultation = require('../models/Consultation');
const HealthCheckup = require('../models/HealthCheckup');
const LeadMagnet = require('../models/LeadMagnet');
const JobApplication = require('../models/JobApplication');
const asyncHandler = require('../utils/asyncHandler');
const { getDbStatus } = require('../config/database');

const getDashboardMetrics = asyncHandler(async (req, res) => {
  const [totalEnquiries, totalConsultations, totalHealthCheckups, totalLeadMagnets, totalApplications] = await Promise.all([
    ContactEnquiry.countDocuments(),
    Consultation.countDocuments(),
    HealthCheckup.countDocuments(),
    LeadMagnet.countDocuments(),
    JobApplication.countDocuments(),
  ]);

  const recentEnquiries = (await ContactEnquiry.find()).slice(0, 5);
  const recentApplications = (await JobApplication.find()).slice(0, 5);

  res.status(200).json({
    success: true,
    data: {
      metrics: {
        totalEnquiries,
        totalConsultations,
        totalHealthCheckups,
        totalLeadMagnets,
        totalApplications,
        overallLeads: totalEnquiries + totalConsultations + totalHealthCheckups + totalLeadMagnets,
      },
      system: getDbStatus(),
      recentEnquiries,
      recentApplications,
    },
  });
});

const getAllEnquiries = asyncHandler(async (req, res) => {
  const enquiries = await ContactEnquiry.find();
  res.status(200).json({
    success: true,
    count: enquiries.length,
    data: enquiries,
  });
});

const updateEnquiryStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const updated = await ContactEnquiry.findByIdAndUpdate(id, { status }, { new: true });
  res.status(200).json({
    success: true,
    data: updated,
  });
});

const getAllApplications = asyncHandler(async (req, res) => {
  const applications = await JobApplication.find();
  res.status(200).json({
    success: true,
    count: applications.length,
    data: applications,
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

const getAllHealthCheckups = asyncHandler(async (req, res) => {
  const checkups = await HealthCheckup.find();
  res.status(200).json({
    success: true,
    count: checkups.length,
    data: checkups,
  });
});

const getAllLeadMagnets = asyncHandler(async (req, res) => {
  const leads = await LeadMagnet.find();
  res.status(200).json({
    success: true,
    count: leads.length,
    data: leads,
  });
});

module.exports = {
  getDashboardMetrics,
  getAllEnquiries,
  updateEnquiryStatus,
  getAllApplications,
  updateApplicationStatus,
  getAllHealthCheckups,
  getAllLeadMagnets,
};
