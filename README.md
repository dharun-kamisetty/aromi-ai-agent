# AROMI AI Agent - Your Personal AI Wellness Coach

<div align="center">

![AROMI AI Agent](./docs/aromi-banner.png)

**AROMI** is an intelligent, empathetic, and highly adaptive 3D AI Wellness Coach built for the ArogyaMitra platform. AROMI generates personalized fitness and nutrition plans using advanced AI with real-time 3D avatar rendering.

[Features](#features) | [Tech Stack](#tech-stack) | [Setup](#setup) | [Architecture](#architecture)

</div>

---

## 🌟 Overview

AROMI (Adaptive Responsive Optimized Medical Intelligence) is an AI-powered wellness coach that combines:

- **Natural Language Understanding** - Groq-powered LLM for intelligent conversations
- **Text-to-Speech** - Coqui TTS for natural voice output
- **Speech-to-Text** - Faster-Whisper for voice input
- **3D Avatar Animation** - React Three Fiber with lip synchronization
- **Personalized wellness plans** - Custom workout and nutrition recommendations

---

## 🎯 Features

### Core Features
- 🤖 **AI-Powered Conversations** - Natural dialogue about fitness and nutrition
- 📋 **Personalized Workout Plans** - 7-day customized fitness routines
- 🥗 **Nutrition Guidance** - Meal plans and calorie targets
- 🎭 **3D Avatar with Lip Sync** - Realistic talking avatar with synchronized mouth movements
- 🎤 **Voice Input** - Speak directly to AROMI
- 📱 **Responsive UI** - Works on desktop and mobile

### Safety Features
- ⚠️ **Medical Disclaimer** - Prominent safety warnings
- 🛡️ **Health Risk Detection** - Cautious responses for potential health issues
- ✅ **User Profile Validation** - Age-appropriate recommendations

### Gamification
- 🏆 **Charity Points System** - Earn points for consistency
- 📊 **Progress Tracking** - Track your wellness journey
- 🎯 **Goal Setting** - Weight loss, muscle gain, maintenance, endurance, flexibility

---

## 🖼️ Screenshots

### Onboarding Screen
![Onboarding](./docs/onboarding-screen.png)

### Main Chat Interface
![Chat Interface](./docs/main-interface.png)

---

## 🛠 Tech Stack

### Frontend
- **React 18** - UI Framework
- **Vite** - Build tool
- **React Three Fiber** - 3D rendering
- **@react-three/drei** - R3F helpers
- **Tailwind CSS** - Styling

### Backend
- **Node.js** - Runtime
- **Express** - API Server
- **LangChain** - LLM orchestration

### AI/ML
- **Groq Cloud** - LLM inference (gpt-oss-120b)
- **Coqui TTS** - Text-to-speech
- **Faster-Whisper** - Speech-to-text

---

## 🚀 Quick Start

### Prerequisites

```bash
# Node.js 18+
node --version

# Python 3.9+
python3 --version

# ffmpeg
ffmpeg -version
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/dharun-kamisetty/aromi-ai-agent.git
cd aromi-ai-agent
```

2. **Install Python dependencies**
```bash
pip3 install faster-whisper coqui-tts torchcodec
```

3. **Install Node dependencies**
```bash
cd apps/backend
npm install
cd ../frontend
npm install
```

4. **Configure API Keys**

Create `apps/backend/.env`:
```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-120b
```

5. **Start the servers**

Backend:
```bash
cd apps/backend
npm start
```

Frontend (in a new terminal):
```bash
cd apps/frontend
npm run dev
```

6. **Open your browser**
Navigate to `http://localhost:5173`

---

## 📖 User Guide

### First Launch

1. **Accept Disclaimer** - Read and accept the medical disclaimer
2. **Complete Onboarding** - Enter your profile:
   - Age, Weight, Height, Gender
   - Fitness Goal (weight loss, muscle gain, etc.)
   - Activity Level
   - Injuries/Physical Issues
   - Available Equipment

### Interacting with AROMI

**Text Input:**
- Type your question in the chat box
- Press Enter or click Send

**Voice Input:**
- Click the microphone button
- Speak your question
- Click again to stop

### Example Commands

```
"Create a workout plan for me"
"Give me a nutrition plan"
"I'm traveling, what can I do?"
"I have knee pain, what exercises are safe?"
"Give me a healthy breakfast idea"
```

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐ │
│  │  3D Avatar   │  │ Chat UI      │  │ Onboarding Form  │ │
│  └──────────────┘  └──────────────┘  └──────────────────┘ │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/WebSocket
┌──────────────────────────▼──────────────────────────────────┐
│                      Backend (Express)                       │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐ │
│  │ Groq LLM     │  │ Coqui TTS    │  │ Faster-Whisper   │ │
│  │ (AROMI AI)   │  │ (Speech)     │  │ (STT)            │ │
│  └──────────────┘  └──────────────┘  └──────────────────┘ │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │ Lip Sync     │  │ Rhubarb      │                        │
│  │ Generator    │  │ Lip Sync     │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/tts` | POST | Text-to-Speech with lip sync |
| `/sts` | POST | Speech-to-Speech (voice input) |

### Request/Response Format

**POST /tts**
```json
{
  "message": "Create a workout plan for me",
  "userContext": {
    "age": 25,
    "weight": 70,
    "height": 175,
    "fitnessGoal": "weight_loss"
  }
}
```

**Response**
```json
{
  "messages": [{
    "text": "Here's your personalized workout plan...",
    "facialExpression": "smile",
    "animation": "TalkingOne",
    "audio": "base64_encoded_audio",
    "lipsync": { "mouthCues": [...] }
  }],
  "aroma": {
    "intent": "workout_plan",
    "spoken_response": "...",
    "plan": { "day1": "...", "day2": "..." },
    "nutrition": { "breakfast": "...", "lunch": "..." },
    "charity_points_awarded": 10
  }
}
```

---

## 📁 Project Structure

```
aromi-ai-agent/
├── apps/
│   ├── backend/
│   │   ├── modules/
│   │   │   ├── openAI.mjs          # Groq LLM integration
│   │   │   ├── aromaValidator.mjs # Response validation
│   │   │   ├── stt.mjs            # Speech-to-text
│   │   │   ├── tts.mjs            # Text-to-speech
│   │   │   ├── lip-sync.mjs       # Lip sync orchestration
│   │   │   └── rhubarbLipSync.mjs # Lip sync generation
│   │   ├── scripts/
│   │   │   ├── stt.py             # Faster-Whisper script
│   │   │   └── tts.py             # Coqui TTS script
│   │   ├── audios/                # Generated audio files
│   │   ├── bin/                   # Rhubarb binary
│   │   ├── server.js              # Express server
│   │   └── package.json
│   │
│   └── frontend/
│       ├── src/
│       │   ├── components/
│       │   │   ├── Avatar.jsx      # 3D avatar component
│       │   │   ├── ChatInterface.jsx # Chat UI
│       │   │   ├── Onboarding.jsx  # User profile form
│       │   │   ├── Disclaimer.jsx  # Medical disclaimer
│       │   │   └── Scenario.jsx    # 3D environment
│       │   ├── hooks/
│       │   │   └── useSpeech.jsx  # Speech context
│       │   ├── App.jsx
│       │   └── main.jsx
│       ├── public/
│       │   └── models/            # 3D avatar models
│       └── package.json
│
├── docs/                          # Documentation
├── package.json                    # Workspace config
└── README.md
```

---

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GROQ_API_KEY` | Groq cloud API key | Yes |
| `GROQ_MODEL` | Model name (default: openai/gpt-oss-120b) | No |

---

## 🧪 Testing

### Backend API Test

```bash
curl -X POST http://localhost:3000/tts \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello AROMI",
    "userContext": {"age": 25, "weight": 70}
  }'
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- [Groq](https://groq.com) - Fast LLM inference
- [Coqui](https://coqui.ai) - Open source speech AI
- [Ready Player Me](https://readyplayer.me) - 3D avatars
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) - 3D React rendering

---

<div align="center">

**Built with ❤️ for the Gen AI Forge 2026 Hackathon**

</div>
