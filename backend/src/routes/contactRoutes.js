const express = require('express');
const router = express.Router();
const { submitContact, getContacts } = require('../controllers/contactController');
const contactValidator = require('../validators/contactValidator');
const { submissionLimiter } = require('../middleware/rateLimiter');

router.route('/')
  .post(submissionLimiter, contactValidator, submitContact)
  .get(getContacts);

module.exports = router;
