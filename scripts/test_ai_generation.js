import dotenv from "dotenv";
import { generateTripPlan } from "../server/services/aiService.js";

dotenv.config();

async function main() {
  try {
    const result = await generateTripPlan("Varanasi", 3);
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    const status = err?.status;
    if (status === 429) {
      console.error("Gemini API quota/rate-limit error (429). Check your plan/billing and quota limits for this model.");
    }

    console.error(err);
    process.exitCode = 1;
  }
}

main();
