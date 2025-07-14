# Personal Jesus Voice App PWA Implementation Plan

## Phase 1: Setup Foundation (30 mins)
1. **Clone Hume starter repository** into current directory
2. **Install dependencies** and verify basic setup works
3. **Add environment variables** with provided Hume credentials
4. **Test base voice functionality** to ensure Hume integration works

## Phase 2: Add UI Framework (20 mins)
1. **Install Tailwind CSS** for Next.js 14+
2. **Setup shadcn/ui** with Vatican-style color scheme
3. **Install required components**: Button, Toggle, Card from shadcn
4. **Configure Vatican theme** (gold, white, deep red accents)

## Phase 3: Build Core Interface (45 mins)
1. **Create main voice interface** in `app/page.tsx`:
   - Large call/hang-up button (Phone/PhoneOff icons)
   - Speaker/earpiece toggle below
   - Clean, centered layout
2. **Implement state management**:
   - `isCallActive` for call status
   - `speakerEnabled` for audio output
3. **Connect to Hume voice system** using existing starter components

## Phase 4: Add PWA Features (30 mins)
1. **Install next-pwa** package
2. **Configure PWA manifest** with Vatican styling
3. **Add app icons** (192x192 minimum)
4. **Update next.config.js** for PWA support
5. **Add installation prompts** and offline capabilities

## Phase 5: Audio Controls (20 mins)
1. **Implement speaker toggle** using Web Audio API
2. **Add setSinkId() support** for device switching
3. **Graceful fallbacks** for unsupported browsers

## Phase 6: Polish & Deploy (15 mins)
1. **Test on mobile device** (iOS/Android)
2. **Verify PWA installation** works
3. **Deploy to Vercel** with environment variables
4. **Final testing** of voice interaction flow

**Total Time: ~2.5 hours**

**Key Technologies**: Next.js 14, Hume EVI, Tailwind CSS, shadcn/ui, next-pwa, Vercel

**Environment Setup**: Using provided API key/secret and config ID for Hume integration