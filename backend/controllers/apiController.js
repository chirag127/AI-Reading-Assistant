const geminiService = require('../services/geminiService');

/**
 * Handle text summarization requests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function summarizeText(req, res) {
  try {
    const { text, mode } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    const summary = await geminiService.summarizeText(text, mode);
    res.json({ summary });
  } catch (error) {
    console.error('Error in summarizeText controller:', error);
    res.status(500).json({ error: 'Failed to summarize text' });
  }
}

/**
 * Handle key points extraction requests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function extractKeyPoints(req, res) {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    const keyPoints = await geminiService.extractKeyPoints(text);
    res.json({ keyPoints });
  } catch (error) {
    console.error('Error in extractKeyPoints controller:', error);
    res.status(500).json({ error: 'Failed to extract key points' });
  }
}

/**
 * Handle term explanation requests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function explainTerm(req, res) {
  try {
    const { term, context } = req.body;
    
    if (!term) {
      return res.status(400).json({ error: 'Term is required' });
    }
    
    const explanation = await geminiService.explainTerm(term, context);
    res.json({ explanation });
  } catch (error) {
    console.error('Error in explainTerm controller:', error);
    res.status(500).json({ error: 'Failed to explain term' });
  }
}

module.exports = {
  summarizeText,
  extractKeyPoints,
  explainTerm
};
