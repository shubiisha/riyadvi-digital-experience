const express = require('express');
const router = express.Router();
const { bookConsultation, getConsultations } = require('../controllers/consultationController');
const consultationValidator = require('../validators/consultationValidator');
const { submissionLimiter } = require('../middleware/rateLimiter');

router.route('/')
  .post(submissionLimiter, consultationValidator, bookConsultation)
  .get(getConsultations);

module.exports = router;
