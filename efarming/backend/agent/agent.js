
import { callLLM } from "../config/llm.js";

// Weather code mapping for better interpretation
const WEATHER_CODES = {
    0: "Clear sky",
    1: "Mainly clear", 
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail"
};

// Function to clean and parse JSON response
// Function to clean and parse JSON response
const cleanAndParseJSON = (response) => {
    console.log("Attempting to parse LLM response, length:", response.length);

    if (!response || response.trim().length < 10) {
        throw new Error("Empty or insufficient LLM response");
    }

    // 1️⃣ Remove BOM + trim
    let text = response.replace(/^\uFEFF/, "").trim();

    // 2️⃣ Remove markdown blocks if any
    text = text
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/g, "")
        .trim();

    // 3️⃣ Extract JSON safely
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start === -1 || end === -1 || end <= start) {
        throw new Error("No JSON object found in LLM response");
    }

    text = text.substring(start, end + 1);

    // 4️⃣ Fix smart quotes (THIS WAS MISSING)
    text = text
        .replace(/[“”]/g, '"')
        .replace(/[‘’]/g, "'");

    // 5️⃣ Remove trailing commas (THIS WAS MISSING)
    text = text.replace(/,\s*([}\]])/g, "$1");

    try {
        return JSON.parse(text);
    } catch (err) {
        console.error("FINAL CLEANED JSON (DEBUG):\n", text);
        throw new Error("Unable to parse LLM response as JSON after cleaning");
    }
};


// Add a fallback response generator
const createFallbackResponse = (weatherData, weatherCodes) => {
    // Extract basic weather info
    const temp = weatherData?.current_weather?.temperature || "N/A";
    const weatherCode = weatherData?.current_weather?.weathercode || 0;
    const weatherDesc = weatherCodes[weatherCode] || "Unknown";
    
    return {
        weatherCondition: {
            summary: `Current weather: ${weatherDesc}. Temperature: ${temp}°C`,
            temperature: `Temperature: ${temp}°C`,
            humidity: weatherData?.hourly?.relativehumidity_2m?.[0] ? `${weatherData.hourly.relativehumidity_2m[0]}%` : "Data unavailable",
            rainfall: weatherData?.hourly?.precipitation?.[0] ? `${weatherData.hourly.precipitation[0]} mm` : "No rain",
            suitableFor: "General crops suitable for current conditions"
        },
        recommendedCrops: [
            {
                cropName: "Wheat",
                durationMonths: 6,
                suitabilityScore: "Medium",
                reason: "Generally adaptable to various conditions"
            },
            {
                cropName: "Rice",
                durationMonths: 5,
                suitabilityScore: "Medium",
                reason: "Suitable with adequate water"
            }
        ],
        marketPrices: [
            {
                cropName: "Wheat",
                pricePerKg: "₹25-30",
                demandTrend: "High"
            },
            {
                cropName: "Rice",
                pricePerKg: "₹35-45",
                demandTrend: "High"
            }
        ],
        cultivationCost: [
            {
                cropName: "Wheat",
                costPerAcre: "₹20,000-25,000",
                breakdown: {
                    seeds: "₹2,000-3,000",
                    fertilizers: "₹5,000-7,000",
                    labor: "₹8,000-10,000",
                    irrigation: "₹3,000-4,000",
                    other: "₹2,000-3,000"
                }
            }
        ],
        agriculturalTips: {
            fertilizerRecommendations: ["Use balanced NPK fertilizer", "Apply organic compost"],
            irrigationInstructions: ["Irrigate weekly", "Monitor soil moisture"],
            pestWarnings: ["Watch for aphids during dry spells", "Prevent fungal diseases in humidity"],
            dosAndDonts: ["Do test soil before planting", "Don't over-water"]
        },
        actionPlan: [
            "Step 1: Test soil and prepare land",
            "Step 2: Select suitable crop varieties",
            "Step 3: Plan irrigation schedule",
            "Step 4: Monitor crop health regularly"
        ],
        _note: "Fallback response generated due to LLM service issue"
    };
};

export const agricultureAgent = async ({ weatherJson }) => {
    console.log("Starting agricultureAgent...");
    
    const systemPrompt = `
You are an intelligent Agricultural Advisor Agent for the eFarmer Platform.

You will receive WEATHER DATA in JSON format.

Your task is to analyze the weather data and provide agricultural recommendations in the following structured JSON format:

{
    "weatherCondition": {
        "summary": "Overall weather summary",
        "temperature": "Current temperature analysis",
        "humidity": "Humidity level analysis",
        "rainfall": "Rainfall/precipitation analysis",
        "suitableFor": "Types of crops suitable for these conditions"
    },
    "recommendedCrops": [
        {
            "cropName": "Crop name",
            "durationMonths": Number,
            "suitabilityScore": "High/Medium/Low",
            "reason": "Why this crop is suitable"
        }
    ],
    "marketPrices": [
        {
            "cropName": "Crop name",
            "pricePerKg": "Estimated market price per kg",
            "demandTrend": "High/Medium/Low"
        }
    ],
    "cultivationCost": [
        {
            "cropName": "Crop name",
            "costPerAcre": "Estimated cost per acre",
            "breakdown": {
                "seeds": "Cost",
                "fertilizers": "Cost",
                "labor": "Cost",
                "irrigation": "Cost",
                "other": "Cost"
            }
        }
    ],
    "agriculturalTips": {
        "fertilizerRecommendations": ["Recommendation 1", "Recommendation 2"],
        "irrigationInstructions": ["Instruction 1", "Instruction 2"],
        "pestWarnings": ["Warning 1", "Warning 2"],
        "dosAndDonts": ["Do this", "Don't do that"]
    },
    "actionPlan": [
        "Step 1: Description",
        "Step 2: Description",
        "Step 3: Description"
    ]
}

WEATHER DATA TO ANALYZE:
${JSON.stringify(weatherJson, null, 2)}

WEATHER CODE REFERENCE:
${JSON.stringify(WEATHER_CODES, null, 2)}

IMPORTANT INSTRUCTIONS:
1. Analyze the current weather conditions including temperature, humidity, rainfall, and weather codes
2. Recommend crops that are suitable for the current weather conditions
3. Provide realistic market prices based on current conditions (make reasonable estimates)
4. Give realistic cultivation cost estimates per acre
5. Provide practical agricultural tips and step-by-step action plan
6. Return ONLY valid JSON format, no additional text or explanations
7. Ensure all crop recommendations are practical for the given weather conditions
8. Consider temperature ranges, rainfall, and humidity when recommending crops
9. DO NOT use markdown code blocks (no \`\`\`json)
10. Return ONLY the raw JSON object, nothing else
11. Make sure the JSON is complete and properly closed with all brackets
12. Do not truncate the response

Now analyze the weather data and return the response in the specified JSON format.
`;

    try {
        console.log("Calling LLM with system prompt...");
        const response = await callLLM(systemPrompt);
        console.log("LLM response received, total length:", response.length);
        
        if (!response || response.trim().length < 10) {
            console.error("LLM returned empty or too short response");
            return createFallbackResponse(weatherJson, WEATHER_CODES);
        }
        
        console.log("First 200 chars of LLM response:", response.substring(0, 200));
        console.log("Last 200 chars of LLM response:", response.substring(Math.max(0, response.length - 200)));
        
        // Use the cleaning function to parse the response
        const parsed = cleanAndParseJSON(response);
        console.log("Successfully parsed JSON response");
        console.log("Parsed response keys:", Object.keys(parsed));
        
        return parsed;
        
    } catch (error) {
        console.error("Failed in agricultureAgent:", error.message);
        console.error("Error stack:", error.stack);
        
        // Create a fallback response
        return createFallbackResponse(weatherJson, WEATHER_CODES);
    }
};
