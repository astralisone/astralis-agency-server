import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

async function runSetup() {
  try {
    // Create dist directory if it doesn't exist
    const distPath = path.join(__dirname, '../../dist');
    await fs.mkdir(distPath, { recursive: true });

    // Compile TypeScript
    console.log('Compiling TypeScript...');
    await execAsync('npx tsc');

    // Run database setup
    console.log('Setting up database...');
    await execAsync('node dist/scripts/setupDb.js');

    console.log('\nSetup completed successfully!');
  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  }
}

runSetup(); 