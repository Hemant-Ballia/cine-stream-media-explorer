import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const getMoodMatchedMovie = async (moodPrompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Suggest ONE movie based on this mood/request: "${moodPrompt}". Return ONLY the movie title as a plaintext string with no extra markdown, formatting, or punctuation.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Gemini AI Error:', error);
    return null;
  }
};