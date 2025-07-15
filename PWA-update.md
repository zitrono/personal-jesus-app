# PWA Update Implementation

This document describes the user-initiated PWA update pattern implemented in this codebase.

## Quick Summary

The app uses a deferred service worker activation pattern where users control when updates are applied. When a new version is available, an "Update Available" button appears. Users click to activate the update and reload.

## Core Components

### 1. `useSWUpdate` Hook (hooks/useSWUpdate.ts:3-47)

Manages service worker update detection and activation:

```typescript
const { updateReady, activate } = useSWUpdate();
```

- **updateReady**: Boolean indicating if a new service worker is waiting
- **activate()**: Triggers update by sending SKIP_WAITING message and reloading

Key features:
- Registers service worker with build stamp: `/sw.js#${buildStamp}`
- Monitors `updatefound` event for new versions
- Checks for updates when page becomes visible
- Production-only (disabled in development)

### 2. Service Worker (app/sw.js/route.ts:6-103)

Dynamic service worker with deferred activation:

- **Install**: Caches core assets, does NOT call skipWaiting()
- **Message listener**: Waits for 'SKIP_WAITING' message to activate
- **Versioning**: Uses build stamp from URL fragment

### 3. Update Button UI

Current implementation in Nav.tsx:64-77:

```tsx
{updateReady && (
  <div className="fixed inset-0 p-4 flex items-end justify-center pointer-events-none z-40">
    <div className="pointer-events-auto">
      <Button onClick={handleUpdate} className="...">
        <span>🔄</span>
        <span>Update Available</span>
      </Button>
    </div>
  </div>
)}
```

Basic pattern for standalone button:
```tsx
// SWUpdateButton.tsx
import { useSWUpdate } from '@/hooks/useSWUpdate';

export default function SWUpdateButton() {
  const { updateReady, activate } = useSWUpdate();
  
  if (!updateReady) return null;
  
  return (
    <button onClick={activate}>
      Update app
    </button>
  );
}
```

## Implementation Details

### Build Stamp Versioning
- Environment variable: `NEXT_PUBLIC_BUILD`
- Fallback: `dev-${Date.now()}`
- Appended to service worker URL as fragment

### Update Flow
1. Service worker detects new version via `updatefound`
2. New worker installs but waits (no skipWaiting)
3. Hook sets `updateReady` to true
4. Update button appears
5. User clicks → `activate()` called
6. SKIP_WAITING message sent to waiting worker
7. Page reloads when controller changes

### Additional Behaviors
- Automatic update check on page visibility change
- PWA install prompt reset on update (localStorage clear)
- Service worker only active in production builds

## Technical Notes

- Cache naming: `core-${VERSION}`
- Static assets only - no API/WebSocket interception
- Controller change listener triggers reload
- Compatible with iOS PWA requirements