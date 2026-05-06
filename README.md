# 🎙️ VoiceJournal

**Your AI voice journaling companion** — Speak your thoughts, get AI responses that make you think, and track your mood over time.

## 🌐 Live Demo

🚀 **Production**: [https://voicejournal-psi.vercel.app](https://voicejournal-psi.vercel.app)  
📦 **GitHub**: [https://github.com/chinmaycode1/voice_journal_ai](https://github.com/chinmaycode1/voice_journal_ai)  

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

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Groq API account

### 1. Clone and Install

```bash
git clone https://github.com/chinmaycode1/voice_journal_ai.git
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

## 📱 Browser Compatibility

### ✅ Supported Browsers:

| Browser | Platform | Voice Recording | Status |
|---------|----------|----------------|--------|
| **Chrome** | Desktop | ✅ | Full Support |
| **Chrome** | Android | ✅ | Full Support |
| **Edge** | Desktop | ✅ | Full Support |
| **Edge** | Android | ✅ | Full Support |
| **Safari** | iOS 14.5+ | ✅ | Full Support |
| **Safari** | macOS | ✅ | Full Support |
| **Samsung Internet** | Android | ✅ | Full Support |
| **Firefox** | All | ❌ | No Web Speech API |

### 🎤 Voice Recording Requirements:
- HTTPS connection (required for microphone access)
- Microphone permission granted
- Internet connection (speech recognition uses cloud API)

## 🐛 Troubleshooting

### Voice Recording Not Working
1. **Check Browser**: Use Chrome, Edge, or Safari (Firefox not supported)
2. **Grant Permission**: Allow microphone access when prompted
3. **Check HTTPS**: Voice recording only works on HTTPS
4. **Test Microphone**: Ensure your microphone works in other apps
5. **Check Console**: Look for error messages in browser console

### Authentication Issues
1. **Check Environment Variables**: Verify `.env.local` has correct Supabase credentials
2. **Run Migration**: Ensure database migration ran successfully in Supabase
3. **Check RLS**: Verify Row Level Security policies are enabled
4. **Clear Cache**: Try clearing browser cache and cookies

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run build
```

## 🎯 Key Improvements (Latest Updates)

### ✅ Voice Recording Fixed
- Continuous recording mode enabled
- Auto-restart on recognition end
- Better error handling for mobile
- Microphone permission UI added

### ✅ Fully Responsive
- Mobile-first design (320px+)
- Tablet optimized (768px+)
- Desktop enhanced (1024px+)
- Safe area support for notched devices

### ✅ Zero Console Errors
- All SVG attributes fixed
- TypeScript errors resolved
- Proper error handling throughout

### ✅ Auth System Verified
- Sign up/sign in working
- Google OAuth configured
- Profile creation automatic
- Session management working

## 📝 License

MIT License - feel free to use this project for your portfolio!

---

**Created by Chinmay Sawargaonkar** 🚀

**Made for Gen Z by Gen Z** ✨
