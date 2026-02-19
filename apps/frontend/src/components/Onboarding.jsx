import { useState } from "react";

const STORAGE_KEY = "aromi_user_profile";

const initialFormData = {
  age: "",
  weight: "",
  height: "",
  gender: "",
  fitnessGoal: "",
  activityLevel: "",
  injuries: [],
  equipment: [],
  dietaryRestrictions: [],
  allergies: [],
};

const injuryOptions = [
  "None", "Knee pain", "Back pain", "Shoulder injury", "Ankle injury",
  "Wrist injury", "Neck pain", "Hip pain"
];

const equipmentOptions = [
  "None (bodyweight)", "Dumbbells", "Kettlebells", "Resistance bands",
  "Pull-up bar", "Exercise bike", "Treadmill", "Gym membership"
];

const fitnessGoals = [
  { value: "weight_loss", label: "Weight Loss" },
  { value: "muscle_gain", label: "Muscle Gain" },
  { value: "maintenance", label: "Maintain Weight" },
  { value: "endurance", label: "Build Endurance" },
  { value: "flexibility", label: "Improve Flexibility" }
];

const activityLevels = [
  { value: "sedentary", label: "Sedentary (little or no exercise)" },
  { value: "light", label: "Light (1-3 days/week)" },
  { value: "moderate", label: "Moderate (3-5 days/week)" },
  { value: "active", label: "Active (6-7 days/week)" },
  { value: "very_active", label: "Very Active (intense daily)" }
];

export function Onboarding({ onComplete }) {
  const [formData, setFormData] = useState(initialFormData);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleCheckbox = (field, value) => {
    setFormData((prev) => {
      const current = prev[field];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter((v) => v !== value) };
      } else {
        return { ...prev, [field]: [...current, value] };
      }
    });
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.age || !formData.weight || !formData.height || !formData.gender) {
        setError("Please fill in all required fields");
        return false;
      }
    }
    if (step === 2) {
      if (!formData.fitnessGoal || !formData.activityLevel) {
        setError("Please select your fitness goal and activity level");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
      setError("");
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
    setError("");
  };

  const handleSubmit = () => {
    const userProfile = {
      ...formData,
      age: parseInt(formData.age),
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height),
      injuries: formData.injuries.filter((i) => i !== "None"),
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userProfile));
    onComplete(userProfile);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-lg w-full border border-slate-700 shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome to AROMI</h2>
          <p className="text-slate-400">Your Personal AI Wellness Coach</p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-slate-400">Step {step} of 3</span>
            <span className="text-sm text-emerald-400">{Math.round((step / 3) * 100)}%</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all" style={{ width: `${(step / 3) * 100}%` }} />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-xl text-white font-semibold">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 text-sm mb-1">Age *</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white" placeholder="25" />
              </div>
              <div>
                <label className="block text-slate-300 text-sm mb-1">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white">
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 text-sm mb-1">Weight (kg) *</label>
                <input type="number" name="weight" value={formData.weight} onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white" placeholder="70" />
              </div>
              <div>
                <label className="block text-slate-300 text-sm mb-1">Height (cm) *</label>
                <input type="number" name="height" value={formData.height} onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white" placeholder="170" />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-xl text-white font-semibold">Fitness Profile</h3>
            <div>
              <label className="block text-slate-300 text-sm mb-2">Fitness Goal *</label>
              <div className="grid grid-cols-1 gap-2">
                {fitnessGoals.map((goal) => (
                  <button key={goal.value} onClick={() => setFormData((prev) => ({ ...prev, fitnessGoal: goal.value }))}
                    className={`p-3 rounded-lg text-left transition-all ${formData.fitnessGoal === goal.value ? "bg-emerald-600 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"}`}>
                    {goal.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-slate-300 text-sm mb-2">Activity Level *</label>
              <select name="activityLevel" value={formData.activityLevel} onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white">
                <option value="">Select your activity level</option>
                {activityLevels.map((level) => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-xl text-white font-semibold">Additional Info</h3>
            <div>
              <label className="block text-slate-300 text-sm mb-2">Injuries / Physical Issues</label>
              <div className="grid grid-cols-2 gap-2">
                {injuryOptions.map((injury) => (
                  <button key={injury} onClick={() => handleCheckbox("injuries", injury)}
                    className={`p-2 rounded-lg text-sm transition-all ${formData.injuries.includes(injury) ? "bg-amber-600 text-white" : "bg-slate-700 text-slate-300"}`}>
                    {injury}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-slate-300 text-sm mb-2">Available Equipment</label>
              <div className="grid grid-cols-2 gap-2">
                {equipmentOptions.map((item) => (
                  <button key={item} onClick={() => handleCheckbox("equipment", item)}
                    className={`p-2 rounded-lg text-sm transition-all ${formData.equipment.includes(item) ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-300"}`}>
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <button onClick={handleBack} className="flex-1 px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600">
              Back
            </button>
          )}
          {step < 3 ? (
            <button onClick={handleNext} className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-lg font-semibold">
              Continue
            </button>
          ) : (
            <button onClick={handleSubmit} className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-lg font-semibold">
              Start Your Journey
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function loadUserProfile() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function clearUserProfile() {
  localStorage.removeItem(STORAGE_KEY);
}
