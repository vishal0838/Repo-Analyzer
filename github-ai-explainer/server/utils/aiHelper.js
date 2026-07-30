// server/utils/aiHelper.js
const { GoogleGenAI } = require("@google/genai"); //

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ ERROR: GEMINI_API_KEY is missing in process.env!");
}

const ai = new GoogleGenAI({ apiKey }); //

/**
 * Cleanly strips markdown code fences and parses JSON safely
 */
function cleanAndParseJSON(rawText) {
  try {
    let cleaned = rawText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");

    if (firstBrace !== -1 && lastBrace !== -1) {
      cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    }

    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Failed to parse cleaned JSON string:", err.message);
    throw err;
  }
}

/**
 * 🌟 FALLBACK MODEL CONTROLLER
 * Tries models sequentially until one succeeds.
 */
async function generateWithFallback(prompt, modelsToTry = [
  "gemini-3.5-flash",      // 1st Priority: Best reasoning, speed, and accuracy
  "gemini-3.1-flash-lite", // 2nd Priority: Lightweight fallback, high capacity
  "gemini-3-flash"        // 3rd Priority: Additional active flash fallback
]) {
  let lastError = null;

  for (const model of modelsToTry) {
    try {
      console.log(`🤖 Attempting analysis with model: ${model}...`);
      
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          responseMimeType: "application/json", // Forces JSON mode output
        },
      });

      console.log(`✅ Success using model: ${model}`);
      return response;
    } catch (err) {
      lastError = err;
      const errorMsg = err.message || JSON.stringify(err);

      console.warn(`⚠️ Model ${model} failed: ${errorMsg}`);

      // Continue to the next fallback model in the list
      if (model !== modelsToTry[modelsToTry.length - 1]) {
        console.log(`🔄 Retrying with next fallback model...`);
      }
    }
  }

  // If every model in the array failed, throw the last recorded error
  throw new Error(`All Gemini fallback models failed. Last error: ${lastError?.message || lastError}`);
}

const generateRepoAnalysis = async ({ name, description, language, readme, fileTree }) => {
  try {
    const prompt = `
You are an expert Software Architect and Code Reviewer.
Analyze the following GitHub repository metadata and generate a comprehensive JSON report.

### REPOSITORY INFORMATION:
- Repository Name: ${name}
- Main Language: ${language || "Not specified"}
- Description: ${description || "No description provided"}

### FILE TREE STRUCTURE:
${fileTree ? fileTree.slice(0, 1500) : "Not available"}

### README CONTENT:
${readme ? readme.slice(0, 4000) : "No README found."}

---

### CRITICAL INSTRUCTION:
Return ONLY the raw valid JSON object without markdown code blocks, explanation text, or extra commentary before or after.

{
  "summary": "A comprehensive 3-4 sentence breakdown explaining what this project is.",
  "techStack": ["Technology 1", "Technology 2"],
  "keyFeatures": ["Feature 1", "Feature 2"],
  "directoryStructure": "root/\\n├── src/\\n└── package.json",
  "setupGuide": [
    "1. Prerequisites",
    "2. Clone repository",
    "3. Install dependencies",
    "4. Run project"
  ],
  "architectureOverview": "Detailed architectural description."
}
`;

    // 🚀 Execution with model fallbacks
    const response = await generateWithFallback(prompt);
    
    // 🧼 Parse extracted JSON
    const parsedData = cleanAndParseJSON(response.text);
    return parsedData;

  } catch (error) {
    console.error("Gemini AI Analysis Exhausted All Options Error:", error.message || error);
    return {
      summary: "Failed to generate AI analysis due to service unavailability.",
      techStack: [language || "Unknown"],
      keyFeatures: ["Information unavailable at this moment."],
      directoryStructure: "Directory structure could not be parsed.",
      setupGuide: ["Check the raw README in the repository for setup instructions."],
      architectureOverview: "Architecture analysis unavailable.",
    };
  }
};

module.exports = { generateRepoAnalysis };