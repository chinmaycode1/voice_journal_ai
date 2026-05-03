# 🚀 Voice Journal AI - Deployment Guide

## 📍 Live URLs

- **Production App**: https://voicejournal-psi.vercel.app
- **GitHub Repository**: https://github.com/chinmaycode1/voice_journal_ai
- **Vercel Dashboard**: https://vercel.com/chinmaysawargaonkar-7629s-projects/voicejournal

## 🏠 Local Development

### Running Locally
```bash
cd voicejournal
npm install
npm run dev
```

**Local URL**: http://localhost:5174/

### Environment Variables
Create a `.env.local` file with:
```env
VITE_SUPABASE_URL=https://kdupxulnceiabvejwtyh.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GROQ_API_KEY=your_groq_api_key
```

## 🔧 Vercel Configuration

### Environment Variables (Already Set)
Go to: https://vercel.com/chinmaysawargaonkar-7629s-projects/voicejournal/settings/environment-variables

Add these variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_GROQ_API_KEY`

### Build Settings
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## 📦 Project Structure

```
voicejournal/
├── src/
│   ├── components/
│   │   ├── avatar/
│   │   │   ├── AvatarCard.tsx      # SVG avatar card wrapper
│   │   │   └── AvatarFace.tsx      # Animated SVG faces (5 personalities)
│   │   ├── journal/                # Voice recording & AI response
│   │   ├── history/                # Entry history & search
│   │   ├── layout/                 # Navigation & page wrappers
│   │   └── ui/                     # Reusable UI components
│   ├── pages/
│   │   ├── Landing.tsx             # Landing page
│   │   ├── Auth.tsx                # Login/signup
│   │   ├── Journal.tsx             # Main journaling page
│   │   ├── History.tsx             # Past entries
│   │   ├── Stats.tsx               # XP & mood analytics
│   │   └── Settings.tsx            # User settings
│   ├── hooks/                      # Custom React hooks
│   ├── lib/                        # Utilities & configs
│   ├── store/                      # Zustand state management
│   └── types/                      # TypeScript types
├── supabase/
│   └── migrations/                 # Database schema
└── public/                         # Static assets
```

## ✨ Key Features

### 🎭 5 AI Personalities (SVG Avatars)
- **Therapist** 🧘 - Warm, empathetic, glasses
- **Hype Friend** 🔥 - Energetic, baseball cap
- **Philosopher** 🌌 - Wise, beard & mustache
- **Roast Mode** 😈 - Sarcastic, smirk
- **Poet** ✨ - Lyrical, flowing hair

### 🎨 Avatar Animations
- ✅ Realistic blinking (every 2-5 seconds)
- ✅ Procedural lip-sync when speaking
- ✅ Eyebrows raise when listening
- ✅ Mood-based expressions
- ✅ Sound waves when speaking
- ✅ Listening indicator waves
- ✅ 3D card flip on mode switch

### 🎯 Core Features
- 🎤 Voice recording with Web Speech API
- 🤖 AI responses via Groq (llama-3.3-70b-versatile)
- 😊 Real-time mood detection
- 🏆 XP system with levels
- 📊 Mood tracking & analytics
- 📝 Entry history with search
- 🎨 Dark/light theme
- 📱 Fully responsive design

## 🔄 Deployment Workflow

### Automatic Deployments
Every push to `main` branch automatically deploys to Vercel.

### Manual Deployment
```bash
# Build locally
npm run build

# Deploy to Vercel
vercel --prod
```

### Git Workflow
```bash
# Make changes
git add .
git commit -m "Your commit message"
git push origin main
```

## 🐛 Troubleshooting

### Build Warnings
The "chunk size" warning is normal for this app size. To reduce:
- Enable code splitting in `vite.config.ts`
- Lazy load more components
- Use dynamic imports

### Environment Variables Not Working
1. Check Vercel dashboard environment variables
2. Ensure all three variables are set
3. Redeploy after adding variables

### Local Development Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

## 📊 Build Status

✅ **TypeScript**: 0 errors  
✅ **Build**: Successful  
⚠️ **Bundle Size**: 1.26 MB (consider code splitting)  
✅ **Deployment**: Live on Vercel  

## 🔐 Security Notes

- ✅ `.env.local` is in `.gitignore`
- ✅ API keys are environment variables
- ✅ Supabase RLS policies enabled
- ✅ CORS configured for production domain

## 📝 Recent Changes

### Latest Update: SVG Avatar Migration
- ❌ Removed Three.js (3D avatars)
- ✅ Added animated SVG cartoon faces
- ✅ 100% offline-capable
- ✅ Reduced bundle size by 51 packages
- ✅ Improved performance

## 🎯 Next Steps

1. ✅ Add environment variables to Vercel
2. ✅ Test production deployment
3. 🔄 Monitor performance
4. 🔄 Gather user feedback
5. 🔄 Optimize bundle size

## 📞 Support

- **GitHub Issues**: https://github.com/chinmaycode1/voice_journal_ai/issues
- **Vercel Support**: https://vercel.com/support

---

**Last Updated**: $(Get-Date -Format "yyyy-MM-dd HH:mm")  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
