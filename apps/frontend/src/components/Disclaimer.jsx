import { useState } from "react";

export function Disclaimer({ onAccept, onDecline }) {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    if (accepted) {
      localStorage.setItem("aromi_disclaimer_accepted", "true");
      onAccept();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-lg w-full border border-slate-700">
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Important Disclaimer</h2>
        </div>

        <div className="space-y-4 text-slate-300 text-sm leading-relaxed mb-6">
          <p>
            <strong className="text-amber-400">AROMI</strong> is an AI-powered wellness coach designed to provide 
            general fitness and nutrition guidance. However, this is <strong>not medical advice</strong>.
          </p>
          
          <ul className="list-disc list-inside space-y-2 text-slate-400">
            <li>This platform does not provide medical diagnosis or treatment</li>
            <li>Consult a healthcare professional before starting any fitness program</li>
            <li>Stop exercising immediately if you experience pain or discomfort</li>
            <li>The AI may not be aware of your complete medical history</li>
            <li>Nutrition recommendations are general guidelines, not personalized medical advice</li>
          </ul>
        </div>

        <div className="mb-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)}
              className="w-5 h-5 rounded" />
            <span className="text-slate-300 text-sm">I understand and acknowledge this disclaimer</span>
          </label>
        </div>

        <div className="flex gap-3">
          <button onClick={onDecline} className="flex-1 px-6 py-3 bg-slate-700 text-white rounded-lg">
            I Don't Agree
          </button>
          <button onClick={handleAccept} disabled={!accepted}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold ${accepted ? "bg-gradient-to-r from-emerald-600 to-teal-500 text-white" : "bg-slate-600 text-slate-400"}`}>
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}

export function isDisclaimerAccepted() {
  return localStorage.getItem("aromi_disclaimer_accepted") === "true";
}
