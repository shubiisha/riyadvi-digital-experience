const express = require('express');
const router = express.Router();
const { downloadLeadMagnet, getLeadMagnets } = require('../controllers/leadMagnetController');
const leadMagnetValidator = require('../validators/leadMagnetValidator');
const { submissionLimiter } = require('../middleware/rateLimiter');

router.route('/')
  .post(submissionLimiter, leadMagnetValidator, downloadLeadMagnet)
  .get(getLeadMagnets);

module.exports = router;
