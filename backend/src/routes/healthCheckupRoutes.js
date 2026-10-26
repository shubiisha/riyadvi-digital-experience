const express = require('express');
const router = express.Router();
const { submitHealthCheckup, getHealthCheckups } = require('../controllers/healthCheckupController');
const healthCheckupValidator = require('../validators/healthCheckupValidator');
const { submissionLimiter } = require('../middleware/rateLimiter');

router.route('/')
  .post(submissionLimiter, healthCheckupValidator, submitHealthCheckup)
  .get(getHealthCheckups);

module.exports = router;
