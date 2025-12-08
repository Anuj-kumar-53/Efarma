import dotenv from "dotenv";
dotenv.config();

export const callLLM = async (prompt) => {
  try {
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      console.error("GEMINI_API_KEY not found in environment variables");
      throw new Error("GEMINI_API_KEY not set");
    }

    console.log("Calling Gemini API with prompt length:", prompt.length);
    
    // Use the non-streaming endpoint
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 4000,
        }
      }),
      timeout: 30000 // 30 second timeout
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error - Status:", response.status);
      console.error("Gemini API Error - Body:", errorText);
      throw new Error(`Gemini API Error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Gemini API Response received");
    
    // Extract text from response
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      console.error("No text in Gemini response. Full response:", JSON.stringify(data, null, 2));
      throw new Error("Empty response from Gemini");
    }
    
    console.log("Gemini response text length:", text.length);
    console.log("First 200 chars:", text.substring(0, 200));
    
    return text;
    
  } catch (error) {
    console.error("LLM Error in callLLM:", error.message);
    console.error("Error stack:", error.stack);
    throw error;
  }
};
