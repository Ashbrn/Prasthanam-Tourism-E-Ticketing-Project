import dotenv from "dotenv";

dotenv.config();

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Missing GEMINI_API_KEY in environment variables");
    process.exitCode = 1;
    return;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`;

  const res = await fetch(url);
  const text = await res.text();

  let body;
  try {
    body = JSON.parse(text);
  } catch {
    console.error("Non-JSON response from ListModels:", text);
    process.exitCode = 1;
    return;
  }

  if (!res.ok) {
    console.error("ListModels failed:", res.status, res.statusText);
    console.error(body);
    process.exitCode = 1;
    return;
  }

  const models = body?.models || [];
  const names = models.map((m) => m?.name).filter(Boolean);

  console.log(`Total models: ${names.length}`);
  console.log("\n--- Models containing '1.5' and 'flash' ---");
  for (const n of names.filter((n) => n.includes("1.5") && n.toLowerCase().includes("flash"))) {
    console.log(n);
  }

  console.log("\n--- All model names ---");
  for (const n of names) {
    console.log(n);
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
