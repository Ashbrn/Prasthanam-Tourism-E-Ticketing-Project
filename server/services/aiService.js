import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function normalizeCityToFileName(city) {
  return city.toLowerCase().trim().replace(/\s+/g, "");
}

async function readCityConfig(city) {
  const fileName = `${normalizeCityToFileName(city)}.json`;
  const cityConfigPath = path.resolve(__dirname, "..", "data", "cities", fileName);
  try {
    const raw = await fs.readFile(cityConfigPath, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    if (err?.code === "ENOENT") {
      return {
        city,
        type: "Religious/Cultural",
        note: "No city-specific configuration file was found. Use general religious/cultural planning heuristics and common local practices."
      };
    }
    throw err;
  }
}

async function readSystemContextFromSpecs() {
  const specsPath = path.resolve(__dirname, "..", "..", "..", "PROJECT_SPECS.md");
  const raw = await fs.readFile(specsPath, "utf-8");

  const startMatch = raw.match(/## 1\. AI SYSTEM CONTEXT[\s\S]*?(?:\r?\n)/);
  if (!startMatch?.index && startMatch?.index !== 0) {
    throw new Error("Could not locate AI SYSTEM CONTEXT header in PROJECT_SPECS.md");
  }

  const startIndex = startMatch.index;
  const afterStart = raw.slice(startIndex);

  const separatorMatch = afterStart.match(/\r?\n---\r?\n/);
  if (!separatorMatch?.index && separatorMatch?.index !== 0) {
    throw new Error("Could not locate section separator after AI SYSTEM CONTEXT in PROJECT_SPECS.md");
  }

  const endIndex = startIndex + separatorMatch.index + separatorMatch[0].length;
  return raw.slice(startIndex, endIndex);
}

function applyTemplateVars(systemContext, { city, days }) {
  return systemContext
    .replaceAll("{{city}}", String(city))
    .replaceAll("{{number_of_days}}", String(days));
}

function extractJsonText(modelText) {
  const text = (modelText || "").trim();

  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenced?.[1]) return fenced[1].trim();

  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return text.slice(firstBrace, lastBrace + 1).trim();
  }

  return text;
}

function parseJsonStrict(modelText) {
  const jsonText = extractJsonText(modelText);

  try {
    return JSON.parse(jsonText);
  } catch (err) {
    const preview = jsonText.length > 800 ? `${jsonText.slice(0, 800)}...` : jsonText;
    const message = err?.message || "Unknown JSON parse error";
    throw new Error(`Gemini response was not valid JSON. ${message}. Response preview: ${preview}`);
  }
}

function normalizeLanguage(language) {
  const raw = String(language || "").trim().toLowerCase();
  if (!raw) return "English";
  if (raw === "hindi") return "Hindi";
  if (raw === "hinglish") return "Hinglish";
  if (raw === "english") return "English";
  return "English";
}

export async function generateTripPlan(city, days, language, originCity) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY in environment variables");
  }

  if (!city || !days) {
    throw new Error("Missing required parameters: city, days");
  }

  const resolvedLanguage = normalizeLanguage(language);

  const [cityConfig, systemContext] = await Promise.all([readCityConfig(city), readSystemContextFromSpecs()]);

  const resolvedSystemContext = applyTemplateVars(systemContext, { city, days });

  const genAI = new GoogleGenerativeAI(apiKey);

  const preferredModelName = "gemini-1.5-flash";
  const fallbackModelName = "gemini-flash-latest";

  const generationConfig = {
    responseMimeType: "application/json"
  };

  const prompt = `${resolvedSystemContext}

### City Context (JSON)
${JSON.stringify(cityConfig, null, 2)}

### Task
Generate a trip plan for:
- City: ${city}
- Days: ${days}
- Language: ${resolvedLanguage}
- Origin: ${originCity || "Not specified"}

STRICT OUTPUT REQUIREMENTS:
- Output MUST be a single valid JSON object.
- No markdown, no code fences, no extra text.
- Must match the schema in PROJECT_SPECS.md (summary + itinerary[] with dayNumber + items[]).
- Generate EXACTLY ${days} days.

CRUCIAL PLANNING RULES (obey strictly):
- Logistics: The user is traveling to ${city} coming from ${originCity || "their origin"}. Crucial: Your first stop on Day 1 MUST be the attraction geographically closest to the highway/train route from ${originCity || "their origin"}. Mention this logistics choice in the summary.
- Density: Plan for maximum efficiency: 2-3 stops per morning/afternoon slot. Do not suggest just one place unless it realistically takes ~4 hours.
- Opening hours: Strictly account for common temple closing windows (usually ~12 PM - 4 PM). Schedule temple-heavy visits in the early morning and evening; schedule museums, ghats, walking streets, markets, and food during the midday break.
- Practical tips: For EVERY itinerary item, include a non-empty \"tips\" field with practical constraints (e.g., no mobile phones allowed, no leather items, locker facility, dress code, best entry gate, shoes storage).
- Ticket & Slot Info: For EVERY location, you MUST include a \"ticketInfo\" object with fields: { required: boolean, approxPrice: string, bookingType: \"Online\" | \"On Spot\", link: string }. If a place needs a ticket (e.g., Zoo, Museum, VIP Darshan), set required: true and provide the official URL or a Google Search URL if unknown. Warn the user if they need to book a specific slot in advance.
- Language: Generate the ENTIRE response in ${resolvedLanguage}. If Hinglish, use Romanized Hindi mixed with English.

STRUCTURE RULES:
- Each day must include Morning, Afternoon, and Evening periods (you may repeat a period multiple times to fit 2-3 places; use \"period\" values Morning/Afternoon/Evening).
`;

  let responseText = "";
  try {
    const model = genAI.getGenerativeModel({
      model: preferredModelName,
      generationConfig
    });
    const result = await model.generateContent(prompt);
    responseText = result?.response?.text?.() ?? "";
  } catch (err) {
    if (err?.status === 404) {
      const model = genAI.getGenerativeModel({
        model: fallbackModelName,
        generationConfig
      });
      const result = await model.generateContent(prompt);
      responseText = result?.response?.text?.() ?? "";
    } else {
      throw err;
    }
  }

  const parsed = parseJsonStrict(responseText);
  return parsed;
}
