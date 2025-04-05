const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

// Summarize text
router.post('/summarize', apiController.summarizeText);

// Extract key points
router.post('/keypoints', apiController.extractKeyPoints);

// Explain term
router.post('/explain', apiController.explainTerm);

module.exports = router;
