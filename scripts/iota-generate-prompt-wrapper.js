#!/usr/bin/env node

/**
 * IOTA Generate Prompt Wrapper Script
 * Generates an AI prompt with current contract details
 */

const fs = require('fs');
const path = require('path');

const contractPath = path.join(__dirname, '../contract/pho_restaurant/sources/pho_restaurant.move');
const configPath = path.join(__dirname, '../lib/config.ts');

console.log('📋 Generating AI Prompt...\n');

// Read contract file
let contractCode = '';
if (fs.existsSync(contractPath)) {
  contractCode = fs.readFileSync(contractPath, 'utf-8');
}

// Read config file
let packageId = '';
if (fs.existsSync(configPath)) {
  const configContent = fs.readFileSync(configPath, 'utf-8');
  const match = configContent.match(/DEVNET_PACKAGE_ID = "([^"]+)"/);
  if (match) {
    packageId = match[1];
  }
}

// Generate prompt
const prompt = `# Pho Restaurant dApp - Contract Customization

## Current Contract Configuration

**Network**: Devnet
**Package ID**: \`${packageId || 'Not deployed yet - run npm run iota-deploy'}\`
**Module**: pho_restaurant::pho

## Current Move Contract

\`\`\`move
${contractCode}
\`\`\`

## Request

[Add your customization request here]

---

Please update the contract to:
1. Modify structs as needed
2. Update function signatures
3. Maintain all safety checks
4. Keep proper error handling
`;

// Save prompt to file
const promptDir = path.join(__dirname, '../prompts');
if (!fs.existsSync(promptDir)) {
  fs.mkdirSync(promptDir, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
const promptFile = path.join(promptDir, `prompt_${timestamp}.md`);

fs.writeFileSync(promptFile, prompt);

console.log(`✅ Prompt generated: ${promptFile}\n`);
console.log('📋 Content:\n');
console.log(prompt);
console.log('\n💡 Tip: Copy this prompt to ChatGPT, Claude, or Gemini for contract modifications!');
