import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { openAIChain, parser } from "./modules/openAI.mjs";
import { lipSync } from "./modules/lip-sync.mjs";
import { convertAudioToText } from "./modules/stt.mjs";
import { validateAromiResponse, formatUserContext } from "./modules/aromaValidator.mjs";

dotenv.config();

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(cors());
const port = 3000;

const defaultResponse = {
  intent: "general",
  spoken_response: "I'm here to help you with your wellness journey. What would you like to work on today?",
  plan: null,
  nutrition: null,
  calories_target: null,
  charity_points_awarded: 0,
  warnings: null,
  facialExpression: "smile",
  animation: "TalkingOne",
};

const greetingResponse = {
  intent: "greeting",
  spoken_response: "Hello! I'm AROMI, your AI Wellness Coach. I'm here to help you achieve your fitness and nutrition goals. Let's start your personalized wellness journey!",
  plan: null,
  nutrition: null,
  calories_target: null,
  charity_points_awarded: 10,
  warnings: null,
  facialExpression: "smile",
  animation: "TalkingOne",
};

app.post("/tts", async (req, res) => {
  const { message, userContext } = req.body;
  const formattedContext = formatUserContext(userContext);
  
  if (!message || message.trim() === "") {
    res.send({ messages: [greetingResponse] });
    return;
  }

  let aromaResponse;
  try {
    const rawResponse = await openAIChain.invoke({
      question: message,
      userContext: formattedContext,
      format_instructions: parser.getFormatInstructions(),
    });
    
    aromaResponse = validateAromiResponse(rawResponse);
    
    if (!aromaResponse) {
      aromaResponse = { ...defaultResponse, spoken_response: "I didn't quite catch that. Could you please repeat?" };
    }
  } catch (error) {
    console.error("LLM Error:", error);
    aromaResponse = { ...defaultResponse, spoken_response: "I'm having trouble processing that. Let me try again." };
  }

  const messages = [{
    text: aromaResponse.spoken_response,
    facialExpression: aromaResponse.facialExpression || "smile",
    animation: aromaResponse.animation || "TalkingOne",
    intent: aromaResponse.intent,
    plan: aromaResponse.plan,
    nutrition: aromaResponse.nutrition,
    calories_target: aromaResponse.calories_target,
    charity_points_awarded: aromaResponse.charity_points_awarded,
    warnings: aromaResponse.warnings,
  }];

  try {
    const syncedMessages = await lipSync({ messages });
    res.send({ messages: syncedMessages, aroma: aromaResponse });
  } catch (error) {
    console.error("Lip sync error:", error);
    res.send({ messages: messages, aroma: aromaResponse });
  }
});

app.post("/sts", async (req, res) => {
  const { audio, userContext } = req.body;
  const formattedContext = formatUserContext(userContext);
  
  let userMessage = "";
  
  try {
    const base64Audio = audio;
    const audioData = Buffer.from(base64Audio, "base64");
    userMessage = await convertAudioToText({ audioData });
  } catch (error) {
    console.error("STT Error:", error);
    res.send({ 
      messages: [{ 
        text: "I couldn't understand that. Could you try again?", 
        facialExpression: "sad", 
        animation: "ThoughtfulHeadShake" 
      }] 
    });
    return;
  }

  let aromaResponse;
  try {
    const rawResponse = await openAIChain.invoke({
      question: userMessage,
      userContext: formattedContext,
      format_instructions: parser.getFormatInstructions(),
    });
    
    aromaResponse = validateAromiResponse(rawResponse);
    
    if (!aromaResponse) {
      aromaResponse = { ...defaultResponse, spoken_response: "I didn't quite catch that. Could you please repeat?" };
    }
  } catch (error) {
    console.error("LLM Error:", error);
    aromaResponse = { ...defaultResponse, spoken_response: "I'm having trouble processing that. Let me try again." };
  }

  const messages = [{
    text: aromaResponse.spoken_response,
    facialExpression: aromaResponse.facialExpression || "smile",
    animation: aromaResponse.animation || "TalkingOne",
    intent: aromaResponse.intent,
    plan: aromaResponse.plan,
    nutrition: aromaResponse.nutrition,
    calories_target: aromaResponse.calories_target,
    charity_points_awarded: aromaResponse.charity_points_awarded,
    warnings: aromaResponse.warnings,
  }];

  try {
    const syncedMessages = await lipSync({ messages });
    res.send({ messages: syncedMessages, aroma: aromaResponse });
  } catch (error) {
    console.error("Lip sync error:", error);
    res.send({ messages: messages, aroma: aromaResponse });
  }
});

app.listen(port, () => {
  console.log(`AROMI is listening on port ${port}`);
});
