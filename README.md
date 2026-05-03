# 🎙️ VoiceJournal

**Your AI voice journaling companion** — Speak your thoughts, get AI responses that make you think, and track your mood over time.

## 🌐 Live Demo

🚀 **Production**: [https://voicejournal-psi.vercel.app](https://voicejournal-psi.vercel.app)  
📦 **GitHub**: [https://github.com/chinmaycode1/voice_journal_ai](https://github.com/chinmaycode1/voice_journal_ai)  
🔧 **Local Dev**: http://localhost:5174/

## ✨ Features

### Core Features
- 🎤 **Voice Recording** - Real-time speech-to-text transcription using Web Speech API
- 🤖 **5 AI Personalities** - Choose from Therapist, Hype Friend, Philosopher, Roast Mode, or Poet
- 🎨 **Real-time Waveform** - Live audio visualization using Web Audio API
- 🔊 **Text-to-Speech** - AI responses read aloud with customizable pitch and rate
- 💾 **Auto-save** - Entries automatically saved to Supabase

### Gamification
- ⚡ **XP System** - Earn XP for every entry (10 XP + 2 XP per 10 words)
- 🏆 **10 Levels** - Progress from Newcomer to Transcendent
- 🔥 **Streak Tracking** - Daily journaling streaks with longest streak records
- 🎉 **Level-up Celebrations** - Confetti animations when you level up

### Analytics & Insights
- 📊 **Mood Tracking** - 7 mood types detected by AI
- 📈 **Mood Timeline** - 30-day mood trend visualization
- 🗓️ **Activity Heatmap** - GitHub-style contribution grid
- 📉 **Mode Analytics** - Track which AI modes you use most
- 🎯 **Stats Dashboard** - Comprehensive overview of your journaling journey

### Design
- 🌙 **Dark/Light Mode** - Beautiful themes with smooth transitions
- ✨ **Heavy Animations** - Framer Motion animations throughout
- 🎨 **Gen Z Aesthetic** - Modern, gradient-heavy design
- 📱 **Fully Responsive** - Mobile-first design with bottom navigation
- 🔮 **Glassmorphism** - Modern glass card effects

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v3 + Custom CSS Variables
- **Animations**: Framer Motion v11
- **Routing**: React Router v6
- **State Management**: Zustand
- **Charts**: Recharts
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL + Auth + Storage + RLS)
- **AI**: Groq API (Llama 3.3 70B)
- **Voice**: Web Speech API + Web Speech Synthesis API
- **Audio**: Web Audio API (AnalyserNode)
- **PDF Export**: jsPDF + html2canvas
- **Celebrations**: canvas-confetti

## 📁 Project Structure

```
voicejournal/
├── public/
│   ├── favicon.svg
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   ├── layout/          # Layout components
│   │   ├── journal/         # Journal page components
│   │   ├── stats/           # Stats page components
│   │   ├── history/         # History page components
│   │   └── auth/            # Auth page components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions & configs
│   ├── pages/               # Page components
│   ├── store/               # Zustand stores
│   ├── types/               # TypeScript types
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── supabase/
│   └── migrations/
│       └── 001_init.sql     # Database schema
├── .env.local               # Environment variables (gitignored)
├── .gitignore
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── vercel.json
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Groq API account

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd voicejournal
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the migration file: `supabase/migrations/001_init.sql`
3. Go to **Storage** → Create a new bucket named `avatars` (make it public)
4. Go to **Settings** → **API** → Copy your project URL and anon key

### 3. Set Up Groq API

1. Sign up at [console.groq.com](https://console.groq.com)
2. Go to **API Keys** → Create a new API key
3. Copy the API key

### 4. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GROQ_API_KEY=your_groq_api_key
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🌐 Deploy to Vercel

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

## 🎮 Usage

### First Time Setup
1. Sign up with email or Google
2. Complete onboarding (choose AI mode, try recording)
3. Start journaling!

### Daily Journaling
1. Click the record button (or press Space)
2. Speak your thoughts
3. Click stop when done
4. AI responds based on your chosen mode
5. Entry auto-saves with XP earned

### Exploring Features
- **Journal Page**: Record entries, switch AI modes, adjust TTS settings, interact with 3D avatar
- **History Page**: Search, filter, and replay past entries
- **Stats Page**: View mood trends, streaks, and analytics
- **Settings Page**: Customize profile, preferences, export PDF

---

## 🧑‍🎤 Avatar System - SVG Animated Faces

The app features **5 unique animated SVG cartoon faces** - one for each AI personality!

### ✨ Features:
- ✅ **100% Offline** - No external dependencies or network requests
- ✅ **Realistic Animations** - Blinking, lip-sync, mood expressions
- ✅ **Unique Designs** - Each personality has distinct features:
  - **Therapist** 🧘: Warm skin, blue eyes, glasses, blush cheeks
  - **Hype Friend** 🔥: Tan skin, dark eyes, baseball cap
  - **Philosopher** 🌌: Darker skin, beard & mustache
  - **Roast Mode** 😈: Medium skin, squinting eyes, smirk
  - **Poet** ✨: Pink-tinted skin, purple eyes, flowing hair

### 🎬 Animations:
- **Blinking**: Natural eye blinks every 2-5 seconds
- **Lip-sync**: Procedural mouth movements when speaking
- **Listening**: Eyebrows raise, ear waves appear
- **Mood-based**: Facial expressions change with detected mood
- **3D Flip**: Smooth card rotation when switching modes
- **Sound Waves**: Animated waves beside mouth when speaking

### 🎨 Customization:
All avatar designs are in `src/components/avatar/AvatarFace.tsx`. You can customize:
- Face shapes and colors
- Eye styles and colors
- Accessories (glasses, hats, beards, hair)
- Animation timings
- Mood expressions

---

## 🎨 AI Modes

1. **🧘 Therapist** - Gentle, empathetic, asks reflective questions
2. **🔥 Hype Friend** - Energetic, encouraging, full Gen Z energy
3. **🌌 Philosopher** - Finds deeper meaning in what you said
4. **😈 Roast Mode** - Lovingly sarcastic, roasts you with care
5. **✨ The Poet** - Responds in vivid imagery and lyrical prose

## 📊 XP & Leveling System

- **Base XP**: 10 XP per entry
- **Word Bonus**: +2 XP per 10 words
- **Levels**: 10 levels from Newcomer (Lv.1) to Transcendent (Lv.10)
- **Thresholds**: 0, 50, 150, 300, 500, 750, 1050, 1400, 1850, 2500 XP

## 🎯 Mood Types

- 😊 Happy (score: 6)
- ⚡ Excited (score: 5)
- 🌊 Calm (score: 4)
- 😐 Neutral (score: 3)
- 😰 Anxious (score: 2)
- 💙 Sad (score: 1)
- 🔥 Angry (score: 0)

## 🔒 Security

- Row Level Security (RLS) enabled on all Supabase tables
- Environment variables never exposed client-side
- User data isolated per account
- Secure authentication via Supabase Auth

## 🐛 Troubleshooting

### Speech Recognition Not Working
- Use Chrome, Edge, or Safari (Firefox not supported)
- Grant microphone permissions
- Check browser console for errors

### AI Responses Failing
- Verify Groq API key is correct
- Check API quota/limits
- Ensure internet connection

### Supabase Errors
- Verify environment variables
- Check RLS policies are enabled
- Ensure migration SQL ran successfully

## 📝 License

MIT License - feel free to use this project for your portfolio!

---

**Created by Chinmay Sawargaonkar** 🚀

## 🙏 Credits

Built with ❤️ by **Chinmay Sawargaonkar**

---

**Made for Gen Z by Gen Z** ✨
