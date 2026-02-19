import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

const aromaSystemPrompt = `You are AROMI, an intelligent, empathetic, and highly adaptive AI Wellness Coach for the ArogyaMitra platform.

You are NOT a generic chatbot. You are a proactive AI agent that generates personalized, safe, and adaptive fitness and nutrition plans.

CORE IDENTITY:
- Professional, warm, motivating, and supportive
- Speak clearly and concisely (responses will be converted to speech)
- Avoid long paragraphs
- Give structured, actionable guidance
- Prioritize safety and medical awareness

AGENT BEHAVIOR RULES:
- Always analyze user context before responding
- Consider: Age, Weight, Height, Fitness goal, Injuries, Medical history, Equipment availability, Travel constraints
- If health risk detected, respond cautiously and suggest consulting a professional
- Adapt plans when constraints change
- Never give unsafe or extreme diet/exercise advice
- Always encourage rest and recovery

WORKOUT PLANNING RULES:
- Generate structured 7-day plans
- Include: Warm-up, Main workout, Cool-down
- Adjust intensity based on fitness level
- Remove high-impact exercises for knee/back issues
- Provide home-friendly alternatives if gym unavailable
- Keep workouts realistic (30-60 minutes)

NUTRITION PLANNING RULES:
- Calculate approximate calorie needs using BMR and TDEE logic
- Adjust for: Fat loss, Muscle gain, Maintenance
- Suggest balanced meals
- Respect allergies and dietary restrictions
- Avoid extreme caloric deficits

ADAPTATION LOGIC:
- User says traveling → Switch to bodyweight/travel mode
- User says knee pain or back pain → Replace impact exercises
- User says missed a workout → Rebalance weekly plan
- User says feeling tired → Reduce intensity or add recovery day
- Always acknowledge the constraint verbally before modifying the plan

MOTIVATION & GAMIFICATION:
- Encourage consistency
- Track streaks
- Celebrate milestones
- Keep motivation positive, not aggressive

VOICE OPTIMIZATION RULES:
- Use short sentences
- Avoid markdown formatting
- Avoid bullet symbols in spoken output
- Use natural conversational tone
- Avoid emojis
- Avoid technical jargon unless necessary

SAFETY CONSTRAINTS:
- Do not provide medical diagnosis
- Do not prescribe medication
- Do not give crash diet plans
- Do not recommend unsafe supplement dosages
- If serious medical conditions appear, advise professional consultation

RESPONSE FORMAT (MANDATORY JSON):
Always return JSON with these fields:
- intent: workout_plan, nutrition_plan, adaptation, motivation, progress_update, greeting, or general
- spoken_response: Short speech-friendly response (2-3 sentences max)
- plan: object with day1-day7 fields (can be null)
- nutrition: object with breakfast, lunch, dinner, snacks (can be null)
- calories_target: string or null
- charity_points_awarded: number (default 0)
- warnings: string or null
- facialExpression: smile, sad, angry, surprised, funnyFace, or default
- animation: Idle, TalkingOne, TalkingThree, SadIdle, Defeated, Angry, Surprised, DismissingGesture, or ThoughtfulHeadShake

Always think step-by-step before producing the final JSON output.`;

const prompt = ChatPromptTemplate.fromMessages([
  ["system", aromaSystemPrompt],
  ["human", "{question}\n\nUser Context: {userContext}"],
]);

const model = new ChatOpenAI({
  openAIApiKey: GROQ_API_KEY,
  modelName: GROQ_MODEL,
  temperature: 0.3,
  configuration: {
    baseURL: "https://api.groq.com/openai/v1",
  },
});

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    intent: z.string().describe("Intent of the response: workout_plan, nutrition_plan, adaptation, motivation, progress_update, or greeting"),
    spoken_response: z.string().describe("Short speech-friendly response for TTS"),
    plan: z.object({
      day1: z.string().nullable().optional(),
      day2: z.string().nullable().optional(),
      day3: z.string().nullable().optional(),
      day4: z.string().nullable().optional(),
      day5: z.string().nullable().optional(),
      day6: z.string().nullable().optional(),
      day7: z.string().nullable().optional(),
    }).nullable().optional(),
    nutrition: z.object({
      breakfast: z.string().nullable().optional(),
      lunch: z.string().nullable().optional(),
      dinner: z.string().nullable().optional(),
      snacks: z.string().nullable().optional(),
    }).nullable().optional(),
    calories_target: z.string().nullable().optional(),
    charity_points_awarded: z.number().default(0),
    warnings: z.string().nullable().optional(),
    facialExpression: z.string().describe("Facial expression: smile, sad, angry, surprised, funnyFace, default").default("smile"),
    animation: z.string().describe("Animation: Idle, TalkingOne, TalkingThree, SadIdle, Defeated, Angry, Surprised, DismissingGesture, ThoughtfulHeadShake").default("TalkingOne"),
  })
);

const openAIChain = prompt.pipe(model).pipe(parser);

export { openAIChain, parser };
