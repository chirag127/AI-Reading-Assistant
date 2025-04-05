const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

/**
 * Summarize text using Gemini API
 * @param {string} text - The text to summarize
 * @param {string} mode - Summary mode (brief, detailed, bullets)
 * @returns {Promise<string>} - The summarized text
 */
async function summarizeText(text, mode = 'brief') {
  try {
    let prompt;
    
    switch (mode) {
      case 'brief':
        prompt = `Provide a brief summary (2-3 sentences) of the following text:\n\n${text}`;
        break;
      case 'detailed':
        prompt = `Provide a detailed summary (1-2 paragraphs) of the following text:\n\n${text}`;
        break;
      case 'bullets':
        prompt = `Provide a bullet-point summary of the following text. Include 5-7 key points:\n\n${text}`;
        break;
      default:
        prompt = `Provide a brief summary (2-3 sentences) of the following text:\n\n${text}`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error summarizing text:', error);
    throw error;
  }
}

/**
 * Extract key points from text using Gemini API
 * @param {string} text - The text to extract key points from
 * @returns {Promise<string[]>} - Array of key points
 */
async function extractKeyPoints(text) {
  try {
    const prompt = `Extract 3-7 key insights from the following text. Format as a JSON array of strings:\n\n${text}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    // Extract JSON array from response
    try {
      // Find JSON array in the response
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // If no JSON array found, split by newlines and clean up
      return responseText
        .split('\n')
        .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
        .map(line => line.replace(/^[-*]\s+/, '').trim());
    } catch (parseError) {
      console.error('Error parsing key points:', parseError);
      // Fallback: return as a single string
      return [responseText];
    }
  } catch (error) {
    console.error('Error extracting key points:', error);
    throw error;
  }
}

/**
 * Explain a term using Gemini API
 * @param {string} term - The term to explain
 * @param {string} context - The context in which the term appears
 * @returns {Promise<string>} - The explanation
 */
async function explainTerm(term, context = '') {
  try {
    let prompt;
    
    if (context) {
      prompt = `Explain the term "${term}" in the context of the following text:\n\n${context}\n\nProvide a clear, concise explanation (1-2 sentences).`;
    } else {
      prompt = `Explain the term "${term}" in a clear, concise way (1-2 sentences).`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error explaining term:', error);
    throw error;
  }
}

module.exports = {
  summarizeText,
  extractKeyPoints,
  explainTerm
};
