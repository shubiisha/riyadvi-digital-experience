const express = require('express');
const router = express.Router();
const { getJobs, getJobBySlug } = require('../controllers/jobController');

router.get('/', getJobs);
router.get('/:slug', getJobBySlug);

module.exports = router;
