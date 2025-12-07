#!/usr/bin/env node

/**
 * IOTA Deploy Wrapper Script
 * Helps deploy your Move contract to IOTA network
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const contractPath = path.join(__dirname, '../contract/pho_restaurant');

console.log(' IOTA Contract Deployment Wrapper');
console.log('=====================================\n');

// Check if contract directory exists
if (!fs.existsSync(contractPath)) {
  console.error(`Contract directory not found: ${contractPath}`);
  process.exit(1);
}

console.log(` Contract path: ${contractPath}\n`);

// Run: iota move build
console.log(' Building Move contract...\n');
const build = spawn('iota', ['move', 'build'], {
  cwd: contractPath,
  stdio: 'inherit'
});

build.on('close', (code) => {
  if (code !== 0) {
    console.error(`\n❌ Build failed with code ${code}`);
    process.exit(1);
  }
 
  console.log('\n Build successful!\n');
  console.log('Next steps:');
  console.log('1. Run: iota move publish');
  console.log('2. Copy the Package ID');
  console.log('3. Update lib/config.ts with your Package ID\n');
});
