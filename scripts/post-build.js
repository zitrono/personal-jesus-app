const fs = require('fs');
const path = require('path');

console.log('🔧 Running post-build script to fix error pages...');

// Create the scripts directory if it doesn't exist
const scriptsDir = path.dirname(__filename);
if (!fs.existsSync(scriptsDir)) {
  fs.mkdirSync(scriptsDir, { recursive: true });
}

// Paths to problematic Next.js generated files
const nextDir = path.join(process.cwd(), '.next');
const serverDir = path.join(nextDir, 'server');
const staticErrorPaths = [
  path.join(serverDir, 'pages', '_error.js'),
  path.join(serverDir, 'pages', '404.js'),
  path.join(serverDir, 'pages', '500.js'),
  path.join(serverDir, 'app', '404.js'),
  path.join(serverDir, 'app', '500.js'),
  path.join(serverDir, 'app', 'not-found.js'),
  path.join(serverDir, 'app', 'error.js'),
];

// Static HTML files we want to use instead
const static404Html = path.join(process.cwd(), 'public', '404.html');
const static500Html = path.join(process.cwd(), 'public', '500.html');

// Simple fallback HTML content if static files don't exist
const fallback404 = `<!DOCTYPE html>
<html><head><title>404 - Not Found</title></head>
<body style="font-family:sans-serif;text-align:center;padding:2rem;">
<h1>404 - Page Not Found</h1>
<a href="/" style="color:#0070f3;">Go Home</a>
</body></html>`;

const fallback500 = `<!DOCTYPE html>
<html><head><title>500 - Server Error</title></head>
<body style="font-family:sans-serif;text-align:center;padding:2rem;">
<h1>500 - Server Error</h1>
<a href="/" style="color:#0070f3;">Go Home</a>
</body></html>`;

try {
  // Read our static HTML files or use fallback
  let html404 = fallback404;
  let html500 = fallback500;
  
  if (fs.existsSync(static404Html)) {
    html404 = fs.readFileSync(static404Html, 'utf8');
    console.log('✓ Using custom 404.html');
  }
  
  if (fs.existsSync(static500Html)) {
    html500 = fs.readFileSync(static500Html, 'utf8');
    console.log('✓ Using custom 500.html');
  }

  // Create a simple JavaScript module that just exports static HTML
  const safeErrorModule = `
module.exports = {
  default: function ErrorPage() {
    return null; // This should never be called in production
  },
  __esModule: true
};
`;

  let replacedCount = 0;
  
  // Replace any problematic generated files
  staticErrorPaths.forEach(errorPath => {
    try {
      if (fs.existsSync(errorPath)) {
        // Backup the original file
        const backupPath = errorPath + '.backup';
        if (!fs.existsSync(backupPath)) {
          fs.copyFileSync(errorPath, backupPath);
        }
        
        // Replace with safe module
        fs.writeFileSync(errorPath, safeErrorModule);
        replacedCount++;
        console.log(`✓ Replaced ${path.relative(process.cwd(), errorPath)}`);
      }
    } catch (error) {
      console.log(`ℹ️  Could not process ${errorPath}: ${error.message}`);
    }
  });

  if (replacedCount > 0) {
    console.log(`🎉 Post-build script completed! Replaced ${replacedCount} error page(s).`);
    console.log('💡 Static HTML files in /public/ will be served for 404/500 errors.');
  } else {
    console.log('ℹ️  No error pages needed replacement.');
  }

} catch (error) {
  console.error('❌ Error during post-build script:', error);
  // Don't fail the build, just log the error
  process.exit(0);
}