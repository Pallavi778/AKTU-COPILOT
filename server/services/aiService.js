const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateContent(prompt) {
  console.log("Prompt length:", prompt.length);

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL,
    contents: prompt,
  });

  console.log(response);

  return response.text;
}

module.exports = { generateContent };