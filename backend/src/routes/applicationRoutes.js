const express = require('express');
const router = express.Router();
const { submitApplication, getApplications, updateApplicationStatus } = require('../controllers/applicationController');
const applicationValidator = require('../validators/applicationValidator');
const { submissionLimiter } = require('../middleware/rateLimiter');

router.route('/')
  .post(submissionLimiter, applicationValidator, submitApplication)
  .get(getApplications);

router.route('/:id/status')
  .patch(updateApplicationStatus);

module.exports = router;
