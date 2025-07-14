# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vatican-themed voice AI chat application built with Next.js that enables real-time conversations with an AI assistant using Hume AI's Empathic Voice Interface (EVI). The app features emotional intelligence, real-time audio visualization, and custom Vatican/Cardinal themed styling.

## Development Commands

**Core Commands:**
```bash
cd personal-jesus-app
npm run dev              # Dev server on 3001 (port 3000 PROHIBITED)
npm run build             # Build for production
npm run start -- -p 3003 # Production server (NEVER use port 3000)
npm run lint              # Run ESLint
```

**Vercel Logs:**
```bash
npx vercel inspect --logs <url>  # Build logs
npx vercel logs <url>            # Runtime logs (follows new logs, Ctrl+C to exit)
```
See [docs/vercel-logs.md](docs/vercel-logs.md) for detailed Vercel logging guide.

**Axiom Logs (Production Errors):**
```bash
# View recent logs
AXIOM_TOKEN="xaat-cc66dfac-9fe6-4019-a00a-29e3896e9e33" axiom query "['jesus'] | sort by _time desc | limit 20"

# Search for errors
AXIOM_TOKEN="xaat-cc66dfac-9fe6-4019-a00a-29e3896e9e33" axiom query "['jesus'] | where level == 'error' or message contains 'error'"

# Filter by time range
AXIOM_TOKEN="xaat-cc66dfac-9fe6-4019-a00a-29e3896e9e33" axiom query "['jesus']" --start-time "-1h"
```

**Environment Setup:**
- Requires `HUME_API_KEY` and `HUME_SECRET_KEY` environment variables
- Get API keys from [Hume AI portal](https://beta.hume.ai/settings/keys)

## Architecture

### Core Technologies
- **Next.js 14** with App Router
- **@humeai/voice-react** for real-time voice AI integration
- **Tailwind CSS 4** with custom Vatican color palette
- **Framer Motion** for animations
- **TypeScript** throughout

### Key Components Structure
- `Chat.tsx` - Main orchestrator with VoiceProvider context
- `StartCall.tsx` - Connection interface with "Call Jesus" branding
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
- **Vatican Color Palette**: Custom CSS properties with Papal Gold, Cardinal Red, Sacred Purple
- **Light/Dark Themes**: Vatican White → Deep Vatican Purple backgrounds
- **Custom Classes**: `.vatican-button`, `.cardinal-red`, `.vatican-toggle`, `.papal-glow`
- **Animation**: `papal-pulse` keyframe animation for golden glow effects

### Data Flow
1. Server-side token generation using Hume API credentials
2. Client connects via VoiceProvider with access token
3. Real-time voice stream processing with emotion analysis
4. Message history management with role-based display
5. Live audio visualization and controls

## Important Files
- `utils/getHumeAccessToken.ts` - Server-only authentication
- `app/globals.css` - Vatican color system and custom components
- `utils/expressionColors.ts` & `utils/expressionLabels.ts` - Emotion visualization data

## Testing & Quality
- ESLint configuration with Next.js rules
- TypeScript strict mode enabled
- No test framework currently configured