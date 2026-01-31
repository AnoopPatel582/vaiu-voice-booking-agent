# 🎙️ Voice-Enabled Restaurant Booking AI Agent

A real-time voice-enabled AI agent that helps users book restaurant tables through natural conversation.
The agent collects booking details via voice, fetches real weather data, suggests indoor/outdoor seating, and stores bookings in a MongoDB database.


## Features

- Core Features

- 🎧 Voice Interaction
    - Speech-to-Text using Deepgram
    - Text-to-Speech using OpenAI

- 🤖 LiveKit Voice Agent
    - Real-time conversation
    - Dynamic agent-room assignment

- 🗣️ Natural Conversation Flow
    - Collects booking details step-by-step

- 🌦️ Real Weather Integration
    - Fetches weather data using OpenWeatherMap
    - Suggests indoor or outdoor seating

- 🗄️ Backend API (Node.js + Express)
    - Create, fetch, and cancel bookings

- 🧾 Database (MongoDB Atlas)
    - Stores bookings with weather and seating info

- 🌐 Frontend (MERN + Vite)
    - Start booking button
    - Live conversation transcript

## Tech Stack

**Frontend:** React (Vite), LiveKit Client SDK

**Backend:** Node.js, Express.js, MongoDB Atlas, OpenWeatherMap API

**Voice & AI:** LiveKit Agents Framework, Deepgram (Speech-to-Text), OpenAI (LLM + Text-to-Speech)

## 🏗️ System Architecture

<div align="left">

```
Frontend (React)
       ↓
Backend (Express API)
       ↓
LiveKit Server
       ↓
LiveKit Voice Agent (Python)
       ↓
MongoDB Atlas + OpenWeatherMap
```

## 📁 Project Structure
```
vaiu-voice-booking-agent/
│
├── frontend/                # React (Vite) frontend
│   ├── src/
│   └── package.json
│
├── backend/                 # Node.js backend
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── models/
│   └── index.js
│
├── agent/                   # LiveKit Python agent
│   ├── agent.py
│   └── requirements.txt
│
└── README.md
```
## ⚙️ Setup Instructions

- 1️⃣ Prerequisites
    - Node.js (v18+ recommended)
    - Python (v3.10+)
    - MongoDB Atlas account
    - LiveKit Server
    - OpenAI API Key
    - Deepgram API Key
    - OpenWeatherMap API Key

- 2️⃣ Clone the Repository
  ```
  git clone https://github.com/your-username/vaiu-voice-booking-agent.git
  cd vaiu-voice-booking-agent
  ```
  
- 3️⃣ Backend Setup
  ```
  cd backend
  npm install
  ```
  
- Create a .env file
  ```
  PORT=5000
  MONGO_URI=your_mongodb_atlas_uri
  LIVEKIT_API_KEY=your_livekit_api_key
  LIVEKIT_API_SECRET=your_livekit_api_secret
  LIVEKIT_URL=ws://localhost:7880
  WEATHER_API_KEY=your_openweather_api_key
  ```
- Start backend
  ```
    node index.js
  ```
- 4️⃣ LiveKit Server Setup
    - Create an account on LiveKit cloud and add credentials in .evn

- 5️⃣ Agent Setup (Python)
```
# Install dependencies using UV
uv sync
```
- Create .env
  ```
  OPENAI_API_KEY= your_open_ai_key(LLM/TTS)
  DEEPGRAM_API_KEY=your_deepgram_api_for(STT)
  # LiveKit cloud credentials
  LIVEKIT_URL=wss://
  LIVEKIT_API_KEY=your_livekit_api_key
  LIVEKIT_API_SECRET=your_api_key_secret

  # Model Selection (Optional)
  # Choose which OpenAI model to use
  LLM_CHOICE=gpt-4.1-mini

  # Development Settings (Optional)
  LOG_LEVEL=INFO
  DEBUG_MODE=false
  ```
- Download Required Model Files
```
uv run python agent.py download-files
```
- Run the Agent
  ```
  # Basic agent (minimal configuration)
  uv run python agent.py console
  # Development mode (connects to LiveKit - optional)
  uv run python agent.py dev
  # Production mode
  uv run python agent.py start
  ```
- Architecture

```
┌─────────────┐     ┌──────────────┐  
│   LiveKit   │──b─▶│ Voice Agent  │
│   Client    │     │              │    
└─────────────┘     └──────────────┘    
                           │
                    ┌──────┴──────┐
                    │             │
              ┌─────▼────┐  ┌────▼─────┐
              │ Deepgram │  │  OpenAI  │
              │   STT    │  │ LLM/TTS  │
              └──────────┘  └──────────┘
```


- Voice Pipeline Configuration
  The agent uses a modular voice pipeline with swappable components:
    - Speech-to-Text (STT)
      - Default: Deepgram Nova-2 (highest accuracy)
      - Alternatives: AssemblyAI, Azure Speech, Whisper
    - Large Language Model (LLM)
      - Default: OpenAI GPT-4.1-mini (fast, cost-effective)
      - Alternatives: Anthropic Claude, Google Gemini, Groq
    - Text-to-Speech (TTS)
      - Default: OpenAI Echo voice (natural, versatile)
      - Alternatives: Cartesia (fastest), ElevenLabs (highest quality)
    - Voice Activity Detection (VAD)
      - Default: Silero VAD (reliable voice detection)
    - Turn Detection
      - Default: Multilingual Model (natural conversation flow)
      - Alternatives: Semantic model, VAD-based
     
        
- 6️⃣ Frontend Setup
  ```
  cd frontend
  npm install
  npm run dev
  ```
  
- 🧪 API Endpoints
  - Bookings API
    - POST /api/bookings – Create booking
    - GET /api/bookings – Get all bookings
    - GET /api/bookings/:id – Get booking by ID
    - DELETE /api/bookings/:id – Cancel booking

- Resources
- [LiveKit Agents Documentation](https://docs.livekit.io/agents/)
- [LiveKit_GitHub_Repo](https://github.com/livekit-examples)
- [Open_AI_API](https://openai.com/api/)
- [Deepgram_API](https://deepgram.com/)


- 🧑‍💻 Author \
  Anoop Patel \
  B.Tech Mechanical Engineering \
  National Institute of Technology (NIT) Sikkim \
  Aspiring Software & AI Developer
