const url = "http://localhost:5000/save";

const payload = {
  city: "Mathura",
  days: 1,
  itinerary: [
    {
      dayNumber: 1,
      items: [
        {
          period: "Morning",
          place: "Shri Krishna Janmabhoomi",
          reason: "Dummy test stop",
          crowdLevel: "High",
          location: { lat: 27.5045, lng: 77.6749 }
        },
        {
          period: "Afternoon",
          place: "Vishram Ghat",
          reason: "Dummy test stop",
          crowdLevel: "Medium",
          location: { lat: 27.4986, lng: 77.6714 }
        },
        {
          period: "Evening",
          place: "Local market",
          reason: "Dummy test stop",
          crowdLevel: "Medium",
          location: { lat: 27.4929, lng: 77.6737 }
        }
      ]
    }
  ]
};

async function main() {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const text = await res.text();

  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = text;
  }

  if (!res.ok) {
    console.error("Request failed:", res.status, res.statusText);
    console.error("Response:", body);
    process.exit(1);
  }

  console.log("Request succeeded:", res.status, res.statusText);
  console.log("Response:", body);
}

main().catch((err) => {
  console.error("Script error:", err);
  process.exit(1);
});
