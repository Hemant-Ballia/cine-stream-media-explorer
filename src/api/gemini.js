export const getMoodMatchedMovie = async (moodPrompt) => {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

  

  try {
    const prompt = `Suggest ONE movie based on this mood/request: "${moodPrompt}". Return ONLY the movie title as a plaintext string with no extra markdown, formatting, or punctuation.`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

     

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text ? text.trim() : null;
  } catch (error) {
    console.error('Gemini API Error:', error);
    return null;
  }
};