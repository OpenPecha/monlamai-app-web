import { ActionFunction, json } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  // Retrieve the text from the form submission
  const formData = await request.formData();
  const text = formData.get("inputText");

  if (typeof text !== "string" || !text.trim()) {
    return json({ error: "No text provided" }, 400);
  }

  const apiKey = process.env.DETECT_LANGUAGE_API_KEY;
  const apiURL = "https://ws.detectlanguage.com/0.2/detect";

  try {
    const apiResponse = await fetch(apiURL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ q: text }),
    });

    if (!apiResponse.ok) {
      return json({
        info: `Failed to detect language with status  ${apiResponse.status}`,
      });
      // throw new Error(`API responded with status: ${apiResponse.status}`);
    }

    const data = await apiResponse.json();
    const detection = data.data.detections[0]; // Access the first (and possibly only) detection
    const language = detection.language;
    const isReliable = detection.isReliable;
    const confidence = detection.confidence;

    return json({ language, isReliable, confidence });
  } catch (error) {
    // console.error("Failed to detect language:", error);
    // return json({ error: "Failed to detect language" }, 500);
    return json({ info: "Failed to detect language" });
  }
};
