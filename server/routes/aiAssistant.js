const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/", async (req, res) => {
  const { type, ...incomingData } = req.body;

  let promptDraft = "";

  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(200).json({
        response: "AI feature is currently unavailable.",
      });
    }

    const activeModel = geminiClient.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    if (type === "itinerary") {
      promptDraft = `Create a ${
        incomingData.days || 2
      }-day travel itinerary for ${incomingData.destination}. 
User interests: ${incomingData.interests}.
Include places, timings, and activities.
Keep it concise (15–20 lines).`;
    } else if (type === "packing-list") {
      const duration = incomingData.days || incomingData.duration || 3;
      promptDraft = `Create a packing list for ${incomingData.destination}.
Trip duration: ${duration} days.
Season: ${incomingData.season}.
Consider weather and activities.
Keep it simple (15–20 lines).`;
    } else if (type === "budget-estimate") {
      const travelDays = incomingData.days || incomingData.duration || 3;
      promptDraft = `Provide a rough budget estimate for a ${travelDays}-day trip to ${incomingData.destination}.
Include accommodation, food, transport, and activities.
Keep it readable (15–20 lines).`;
    } else {
      return res.status(400).json({ msg: "Unknown request type" });
    }

    const result = await activeModel.generateContent(promptDraft);
    const text = result.response.text();

    return res.json({ response: text });
  } catch (error) {
    console.error("Gemini API Error:", error.message);

    return res.status(200).json({
      response:
        "AI service is temporarily unavailable. Please try again later.",
    });
  }
});

module.exports = router;
