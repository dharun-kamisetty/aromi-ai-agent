import { useState, useEffect } from "react";
import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Scenario } from "./components/Scenario";
import { ChatInterface } from "./components/ChatInterface";
import { Onboarding, loadUserProfile, clearUserProfile } from "./components/Onboarding";
import { Disclaimer, isDisclaimerAccepted } from "./components/Disclaimer";
import { SpeechProvider } from "./hooks/useSpeech";

function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const disclaimerSeen = isDisclaimerAccepted();
    const profile = loadUserProfile();

    if (!disclaimerSeen) {
      setShowDisclaimer(true);
    } else if (!profile) {
      setShowOnboarding(true);
    } else {
      setUserProfile(profile);
    }
  }, []);

  const handleDisclaimerAccept = () => {
    setShowDisclaimer(false);
    setShowOnboarding(true);
  };

  const handleDisclaimerDecline = () => {
    alert("You must accept the disclaimer to use AROMI.");
  };

  const handleOnboardingComplete = (profile) => {
    setUserProfile(profile);
    setShowOnboarding(false);
  };

  return (
    <SpeechProvider>
      <Loader />
      <Leva collapsed hidden />
      
      {showDisclaimer && (
        <Disclaimer onAccept={handleDisclaimerAccept} onDecline={handleDisclaimerDecline} />
      )}
      
      {showOnboarding && !showDisclaimer && (
        <Onboarding onComplete={handleOnboardingComplete} />
      )}
      
      <ChatInterface 
        userProfile={userProfile} 
        onResetProfile={() => {
          clearUserProfile();
          setUserProfile(null);
          setShowOnboarding(true);
        }}
      />
      
      <Canvas shadows camera={{ position: [0, 0, 0], fov: 10 }}>
        <Scenario />
      </Canvas>
    </SpeechProvider>
  );
}

export default App;
