const express = require('express');
const router = express.Router();
const {
  getDashboardMetrics,
  getAllEnquiries,
  updateEnquiryStatus,
  getAllApplications,
  updateApplicationStatus,
  getAllHealthCheckups,
  getAllLeadMagnets,
} = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/metrics', getDashboardMetrics);
router.get('/enquiries', getAllEnquiries);
router.patch('/enquiries/:id/status', updateEnquiryStatus);
router.get('/applications', getAllApplications);
router.patch('/applications/:id/status', updateApplicationStatus);
router.get('/health-checkups', getAllHealthCheckups);
router.get('/lead-magnets', getAllLeadMagnets);

module.exports = router;
