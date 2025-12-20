const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/", async (req, res) => {
  const { type, ...incomingData } = req.body;

  let promptDraft = "";

  try {
    const activeModel = geminiClient.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    if (type === "itinerary") {
      promptDraft = `Please make a ${
        incomingData.days || 2
      }-day travel plan for ${incomingData.destination}. 
      The user like ${incomingData.interests}. 
      Add places to visit, timings and some activities. 
      Keep it short (around 15–20 lines).`;
    } else if (type === "packing-list") {
      const duration = incomingData.days || incomingData.duration || 3;
      promptDraft = `Make a packing list for ${incomingData.destination}. 
      Trip is for ${duration} days in ${incomingData.season}. 
      Think about the weather and possible activities. 
      Keep it simple (about 15–20 lines).`;
    } else if (type === "budget-estimate") {
      const travelDays = incomingData.days || incomingData.duration;
      promptDraft = `Give a rough travel budget for ${incomingData.destination}. Trip lasts ${travelDays} days. 
      Add cost ideas like hotel, food, travel and activities. 
      Keep it easy to read (15–20 lines).`;
    } else {
      return res.status(400).json({ msg: "Unknown request type" });
    }

    const resultFromAI = await activeModel.generateContent(promptDraft);

    const cleanedText = resultFromAI.response.text();

    res.json({ response: cleanedText });
  } catch (oops) {
    console.log("Gemini error happened somewhere:", oops);

    res.status(500).json({
      msg: "Something went wrong generating response",
      error: oops.message,
    });
  }
});

module.exports = router;
