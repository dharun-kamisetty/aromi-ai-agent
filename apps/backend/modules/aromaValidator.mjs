import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

export const aromaResponseSchema = z.object({
  intent: z.enum(["workout_plan", "nutrition_plan", "adaptation", "motivation", "progress_update", "greeting", "general"]),
  spoken_response: z.string(),
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
  facialExpression: z.string().default("smile"),
  animation: z.string().default("TalkingOne"),
});

export const userContextSchema = z.object({
  age: z.number().optional(),
  weight: z.number().optional(),
  height: z.number().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  fitnessGoal: z.enum(["weight_loss", "muscle_gain", "maintenance", "endurance", "flexibility"]).optional(),
  activityLevel: z.enum(["sedentary", "light", "moderate", "active", "very_active"]).optional(),
  injuries: z.array(z.string()).optional(),
  medicalHistory: z.array(z.string()).optional(),
  equipment: z.array(z.string()).optional(),
  dietaryRestrictions: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
});

export function validateAromiResponse(response) {
  try {
    return aromaResponseSchema.parse(response);
  } catch (error) {
    console.error("AROMI response validation error:", error);
    return null;
  }
}

export function validateUserContext(context) {
  try {
    return userContextSchema.parse(context);
  } catch (error) {
    console.error("User context validation error:", error);
    return null;
  }
}

export function formatUserContext(context) {
  if (!context) return "No user context available";
  
  const parts = [];
  if (context.age) parts.push(`Age: ${context.age}`);
  if (context.weight) parts.push(`Weight: ${context.weight} kg`);
  if (context.height) parts.push(`Height: ${context.height} cm`);
  if (context.gender) parts.push(`Gender: ${context.gender}`);
  if (context.fitnessGoal) parts.push(`Goal: ${context.fitnessGoal.replace(/_/g, ' ')}`);
  if (context.activityLevel) parts.push(`Activity: ${context.activityLevel}`);
  if (context.injuries?.length) parts.push(`Injuries: ${context.injuries.join(", ")}`);
  if (context.equipment?.length) parts.push(`Equipment: ${context.equipment.join(", ")}`);
  if (context.dietaryRestrictions?.length) parts.push(`Diet: ${context.dietaryRestrictions.join(", ")}`);
  
  return parts.join(", ") || "General wellness inquiry";
}
