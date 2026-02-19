import { useRef, useEffect, useState } from "react";
import { useSpeech } from "../hooks/useSpeech";

export const ChatInterface = ({ userProfile, onResetProfile }) => {
  const input = useRef();
  const { tts, loading, message, startRecording, stopRecording, recording, userContext, setUserContext, aromaData } = useSpeech();
  const [showPlans, setShowPlans] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setUserContext(userProfile);
    }
  }, [userProfile, setUserContext]);

  useEffect(() => {
    if (aromaData && (aromaData.plan || aromaData.nutrition)) {
      setShowPlans(true);
    }
  }, [aromaData]);

  const sendMessage = () => {
    const text = input.current.value;
    if (!loading && !message && text.trim()) {
      setShowPlans(false);
      tts(text);
      input.current.value = "";
    }
  };

  const getIntentLabel = (intent) => {
    const labels = {
      workout_plan: "Workout Plan", nutrition_plan: "Nutrition Plan",
      adaptation: "Plan Adaptation", motivation: "Motivation",
      progress_update: "Progress Update", greeting: "Welcome", general: "General",
    };
    return labels[intent] || "Response";
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex justify-between p-4 flex-col pointer-events-none">
      <div className="self-start backdrop-blur-md bg-white bg-opacity-50 p-4 rounded-lg max-w-md">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="font-black text-2xl text-emerald-700">AROMI</h1>
            <p className="text-sm text-gray-600">Your AI Wellness Coach</p>
          </div>
          {userProfile && (
            <button onClick={onResetProfile} className="text-xs text-gray-500 hover:text-gray-700 underline pointer-events-auto">
              Reset Profile
            </button>
          )}
        </div>
        <p className="text-gray-600 text-sm mt-2">
          {loading ? "Thinking..." : "Ask me about workouts, nutrition, or wellness!"}
        </p>
        {userProfile && (
          <div className="mt-2 text-xs text-emerald-600">
            Goal: {userProfile.fitnessGoal?.replace(/_/g, " ")}
          </div>
        )}
      </div>

      {showPlans && aromaData && (
        <div className="absolute top-32 left-4 right-4 md:left-auto md:right-4 md:w-96 pointer-events-auto z-20">
          <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-500 p-3">
              <span className="text-white font-semibold">{getIntentLabel(aromaData.intent)}</span>
              {aromaData.charity_points_awarded > 0 && (
                <span className="ml-2 bg-yellow-400 text-yellow-900 text-xs px-2 py-0.5 rounded-full">
                  +{aromaData.charity_points_awarded} pts
                </span>
              )}
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              {aromaData.plan && (
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Weekly Plan</h3>
                  <div className="space-y-2">
                    {Object.entries(aromaData.plan).map(([day, workout]) => (
                      workout && (
                        <div key={day} className="bg-slate-50 p-2 rounded text-sm">
                          <span className="font-medium text-emerald-700 capitalize">{day.replace("day", "Day ")}:</span>{" "}
                          <span className="text-gray-600">{workout}</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}
              {aromaData.nutrition && (
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Nutrition</h3>
                  <div className="space-y-2">
                    {Object.entries(aromaData.nutrition).map(([meal, food]) => (
                      food && (
                        <div key={meal} className="bg-slate-50 p-2 rounded text-sm">
                          <span className="font-medium text-teal-700 capitalize">{meal}:</span>{" "}
                          <span className="text-gray-600">{food}</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}
              {aromaData.calories_target && (
                <div className="mb-4 bg-emerald-50 p-3 rounded-lg">
                  <span className="font-medium text-emerald-800">Daily Calories:</span>{" "}
                  <span className="text-emerald-700">{aromaData.calories_target}</span>
                </div>
              )}
              {aromaData.warnings && (
                <div className="mb-4 bg-amber-50 border border-amber-200 p-3 rounded-lg">
                  <span className="text-amber-800 text-sm">{aromaData.warnings}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 pointer-events-auto max-w-screen-sm w-full mx-auto">
        <button
          onClick={recording ? stopRecording : startRecording}
          className={`bg-gray-500 hover:bg-gray-600 text-white p-4 px-4 font-semibold uppercase rounded-md ${
            recording ? "bg-red-500 hover:bg-red-600 animate-pulse" : ""
          } ${loading || message ? "cursor-not-allowed opacity-30" : ""}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
          </svg>
        </button>
        <input
          className="w-full placeholder:text-gray-800 placeholder:italic p-4 rounded-md bg-opacity-50 bg-white backdrop-blur-md"
          placeholder="Ask AROMI about fitness, nutrition..."
          ref={input}
          onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
        />
        <button
          disabled={loading || message}
          onClick={sendMessage}
          className={`bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white p-4 px-10 font-semibold uppercase rounded-md ${
            loading || message ? "cursor-not-allowed opacity-30" : ""
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
};
