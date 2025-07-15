/**
 * Version utilities for displaying build and package information
 * Uses the build stamping system from package.json build:stamped script
 */

// Get version from package.json
const PACKAGE_VERSION = "0.1.0";

/**
 * Get the build stamp from environment variable
 * Format: YYYY-MM-DD-HHMM-{git-hash} (e.g., "2025-07-14-1430-abc123f")
 */
export const getBuildStamp = (): string => {
  return process.env.NEXT_PUBLIC_BUILD || 'dev-build';
};

/**
 * Parse build stamp into readable components
 */
export const parseBuildStamp = (buildStamp: string) => {
  // Handle dev/local builds
  if (buildStamp === 'dev-build' || buildStamp.includes('dev')) {
    return {
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].substring(0, 5),
      hash: 'local',
      isLocal: true
    };
  }

  // Parse production build stamp: YYYY-MM-DD-HHMM-hash
  const parts = buildStamp.split('-');
  if (parts.length >= 5) {
    const [year, month, day, time, hash] = parts;
    const formattedTime = time.substring(0, 2) + ':' + time.substring(2, 4);
    
    return {
      date: `${year}-${month}-${day}`,
      time: formattedTime,
      hash: hash || 'unknown',
      isLocal: false
    };
  }

  // Fallback for unexpected formats
  return {
    date: 'unknown',
    time: 'unknown',
    hash: buildStamp,
    isLocal: false
  };
};

/**
 * Get human-readable version string for display
 */
export const getVersionDisplay = (): string => {
  const buildStamp = getBuildStamp();
  const { date, time, hash, isLocal } = parseBuildStamp(buildStamp);
  
  if (isLocal) {
    return `v${PACKAGE_VERSION} (local development)`;
  }
  
  return `v${PACKAGE_VERSION} (${date} ${time})`;
};

/**
 * Get detailed version information for debug/about display
 */
export const getVersionInfo = () => {
  const buildStamp = getBuildStamp();
  const parsed = parseBuildStamp(buildStamp);
  
  return {
    version: PACKAGE_VERSION,
    buildStamp,
    buildDate: parsed.date,
    buildTime: parsed.time,
    gitHash: parsed.hash,
    isLocal: parsed.isLocal,
    display: getVersionDisplay()
  };
};

/**
 * Get short git hash for display
 */
export const getGitHash = (): string => {
  const { gitHash } = getVersionInfo();
  return gitHash === 'local' ? 'dev' : gitHash;
};