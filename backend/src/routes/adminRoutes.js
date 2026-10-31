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
const {
  listContent,
  createContent,
  updateContent,
  deleteContent,
} = require('../controllers/contentController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// Content management (CMS) — authenticated CRUD over the live site content.
router.get('/content/:collection', listContent);
router.post('/content/:collection', createContent);
router.patch('/content/:collection/:id', updateContent);
router.delete('/content/:collection/:id', deleteContent);

router.get('/metrics', getDashboardMetrics);
router.get('/enquiries', getAllEnquiries);
router.patch('/enquiries/:id/status', updateEnquiryStatus);
router.get('/applications', getAllApplications);
router.patch('/applications/:id/status', updateApplicationStatus);
router.get('/health-checkups', getAllHealthCheckups);
router.get('/lead-magnets', getAllLeadMagnets);

module.exports = router;
