# AROMI AI Agent - Your Personal AI Wellness Coach

<div align="center">

**AROMI** is an intelligent, empathetic, and highly adaptive 3D AI Wellness Coach for the ArogyaMitra platform.

[Features](#features) | [Tech Stack](#tech-stack) | [Setup](#setup) | [Architecture](#architecture)

</div>

## Overview

AROMI (Adaptive Responsive Optimized Medical Intelligence) combines:
- **Natural Language Understanding** - Groq-powered LLM
- **Text-to-Speech** - Coqui TTS
- **Speech-to-Text** - Faster-Whisper
- **3D Avatar Animation** - React Three Fiber with lip sync

## Features

- AI-Powered Conversations
- Personalized Workout Plans (7-day)
- Nutrition Guidance  
- 3D Avatar with Lip Sync
- Voice Input
- User Profile Onboarding
- Medical Disclaimer
- Charity Points System

## Tech Stack

### Frontend
- React 18, Vite, React Three Fiber, Tailwind CSS

### Backend
- Node.js, Express, LangChain

### AI/ML
- Groq Cloud (gpt-oss-120b), Coqui TTS, Faster-Whisper

## Setup

```bash
# Install Python dependencies
pip3 install faster-whisper coqui-tts

# Install Node dependencies
cd apps/backend && npm install
cd ../frontend && npm install

# Configure API key in apps/backend/.env
# GROQ_API_KEY=your_key

# Start servers
cd apps/backend && npm start
cd apps/frontend && npm run dev
```

## Architecture

```
Frontend (React) → Backend (Express) → Groq LLM + Coqui TTS + Faster-Whisper
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/tts` | POST | Text-to-Speech with lip sync |
| `/sts` | POST | Speech-to-Speech |

## License

MIT
