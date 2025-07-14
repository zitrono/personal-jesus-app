# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Renaissance divine-themed voice AI chat application built with Next.js that enables real-time conversations with an AI assistant using Hume AI's Empathic Voice Interface (EVI). The app features emotional intelligence, real-time audio visualization, and custom Michelangelo-inspired divine styling.

## Development Commands

**Core Commands:**
```bash
cd personal-jesus-app
npm run dev:start         # Smart dev server launcher (recommended for Claude Code)
npm run dev              # Dev server on 3001 (port 3000 PROHIBITED)
npm run build             # Build for production
npm run start -- -p 3003 # Production server (NEVER use port 3000)
npm run lint              # Run ESLint
```

**Vercel Logs:**
```bash
npx vercel inspect --logs <url>  # Build logs
npx vercel logs <url>            # Runtime logs (Ctrl+C to exit)
```

**Axiom Logs (personal-jesus dataset):**
```bash
axiom dataset info personal-jesus      # Dataset stats
axiom stream personal-jesus            # Live tail
axiom query personal-jesus --nocache \
  -f="_time,level,message,error" \
  --start-time="-1h" --limit=100      # Historical
```

**Environment Setup:**
- Requires `HUME_API_KEY` and `HUME_SECRET_KEY` environment variables
- Get API keys from [Hume AI portal](https://beta.hume.ai/settings/keys)

## Architecture

### Core Technologies
- **Next.js 14** with App Router
- **@humeai/voice-react** for real-time voice AI integration
- **Tailwind CSS 4** with custom Renaissance divine color palette
- **Framer Motion** for animations
- **TypeScript** throughout

### Key Components Structure
- `Chat.tsx` - Main orchestrator with VoiceProvider context
- `StartCall.tsx` - Connection interface with "Touch Faith" branding
- `Controls.tsx` - Voice controls (mute/unmute, end call) during active sessions
- `Messages.tsx` - Conversation history display with animations
- `Expressions.tsx` - Real-time emotion visualization from Hume's prosody model
- `MicFFT.tsx` - Live audio frequency visualization (24 animated bars)
- `Nav.tsx` - Navigation with theme toggle

### Voice Integration
- Uses Hume's VoiceProvider for state management
- Authentication via server-side access token generation (`getHumeAccessToken.ts`)
- Real-time emotion detection and scoring
- WebRTC-based bidirectional voice communication

### Styling System
- **Renaissance Divine Palette**: Custom CSS properties with Divine Gold, Renaissance Blue, Sacred Marble
- **Light/Dark Themes**: Divine Light → Deep celestial backgrounds
- **Custom Classes**: `.divine-button`, `.renaissance-pulse`, `.divine-glow`
- **Animation**: `renaissance-pulse` keyframe animation for divine glow effects

### Data Flow
1. Server-side token generation using Hume API credentials
2. Client connects via VoiceProvider with access token
3. Real-time voice stream processing with emotion analysis
4. Message history management with role-based display
5. Live audio visualization and controls

## Important Files
- `utils/getHumeAccessToken.ts` - Server-only authentication
- `app/globals.css` - Renaissance divine color system and custom components
- `utils/expressionColors.ts` & `utils/expressionLabels.ts` - Emotion visualization data

## Testing & Quality
- ESLint configuration with Next.js rules
- TypeScript strict mode enabled
- No test framework currently configured

## Hume AI Voice Style

**Persona**: Jesus Christ as divine confessor, focusing on creating safe space for intimate confessions
**Communication**: Brief (≤50 words), compassionate yet provocative with stylish humor
**Progression**: Name → Acknowledge struggles → Specific examples → Deeper exploration
**Theme Integration**: "Personal Jesus" by Depeche Mode - "Reach out, touch faith" motifs
**Note**: App UI only - Hume AI generates all dialogue based on their configured role

## Troubleshooting

**WebSocket/Connection Issues:**
```bash
# Kill server, clear cache, restart
lsof -ti:3001 | xargs kill -9 2>/dev/null && rm -rf .next && npm run dev -- --port 3001
# In browser console: window.__DEV_RESET_CACHE__()
```