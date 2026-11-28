#!/usr/bin/env node
/**
 * Generate TypeScript types from the backend OpenAPI spec.
 *
 * Usage:
 *   npm run generate:api-types
 *
 * This script:
 * 1. Copies openapi.json from the backend project
 * 2. Generates TypeScript types using openapi-typescript
 * 3. Writes to src/generated/api.ts
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const BACKEND_PATH = path.resolve(__dirname, '../../twilight-struggle-backend');
const OPENAPI_SOURCE = path.join(BACKEND_PATH, 'openapi.json');
const OPENAPI_DEST = path.join(__dirname, '../openapi.json');
const TYPES_OUTPUT = path.join(__dirname, '../generated/api.ts');

function main() {
  console.log('📋 Generating API types from backend OpenAPI spec...\n');

  // Step 1: Copy openapi.json from backend
  if (!fs.existsSync(OPENAPI_SOURCE)) {
    console.error(`❌ Backend openapi.json not found at: ${OPENAPI_SOURCE}`);
    console.error('   Run `npm run generate:openapi` in the backend project first.');
    process.exit(1);
  }

  fs.copyFileSync(OPENAPI_SOURCE, OPENAPI_DEST);
  console.log('✅ Copied openapi.json from backend');

  // Step 2: Generate TypeScript types
  try {
    execSync(`npx --yes openapi-typescript ${OPENAPI_DEST} -o ${TYPES_OUTPUT}`, {
      stdio: 'inherit',
    });
    console.log('\n✅ Generated TypeScript types at: generated/api.ts');
  } catch (error) {
    console.error('❌ Failed to generate types:', error);
    process.exit(1);
  }

  console.log('\n🎉 Done! You can now import types from generated/api');
}

main();
