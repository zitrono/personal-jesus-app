#!/usr/bin/env node

const net = require('net');
const { spawn } = require('child_process');
const http = require('http');

const PORT = 3001;
const HOST = 'localhost';

// Check if port is in use
function checkPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, (err) => {
      if (err) {
        resolve(false); // Port is in use
      } else {
        server.close(() => resolve(true)); // Port is available
      }
    });
    server.on('error', () => resolve(false));
  });
}

// Check if dev server is responding
function checkServer(port, timeout = 5000) {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: HOST,
      port: port,
      path: '/',
      method: 'GET',
      timeout: 1000
    }, (res) => {
      resolve(true);
    });
    
    req.on('error', () => resolve(false));
    req.on('timeout', () => resolve(false));
    req.end();
    
    // Overall timeout
    setTimeout(() => resolve(false), timeout);
  });
}

// Wait for server to be ready
async function waitForServer(maxAttempts = 10) {
  for (let i = 0; i < maxAttempts; i++) {
    if (await checkServer(PORT)) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  return false;
}

async function main() {
  console.log('🔍 Checking dev server status...');
  
  // Check if server is already running
  if (await checkServer(PORT)) {
    console.log(`✅ Dev server already running on http://${HOST}:${PORT}`);
    process.exit(0);
  }
  
  // Check if port is available
  const portAvailable = await checkPort(PORT);
  if (!portAvailable) {
    console.log(`⚠️  Port ${PORT} is in use but not responding to HTTP requests`);
    console.log('Try: lsof -ti:3001 | xargs kill -9');
    process.exit(1);
  }
  
  console.log('🚀 Starting dev server...');
  
  // Start dev server in background
  const child = spawn('npm', ['run', 'dev', '--', '--port', PORT.toString()], {
    detached: true,
    stdio: ['ignore', 'pipe', 'pipe']
  });
  
  // Don't wait for child process
  child.unref();
  
  // Wait for server to be ready
  console.log('⏳ Waiting for server to start...');
  const isReady = await waitForServer();
  
  if (isReady) {
    console.log(`✅ Dev server ready on http://${HOST}:${PORT}`);
    process.exit(0);
  } else {
    console.log('❌ Dev server failed to start within timeout');
    console.log('Check manually with: npm run dev');
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('❌ Script error:', error.message);
  process.exit(1);
});