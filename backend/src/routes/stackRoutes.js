const express = require('express');
const router = express.Router();
const { getStackInfo } = require('../controllers/stackController');

router.get('/', getStackInfo);

module.exports = router;
