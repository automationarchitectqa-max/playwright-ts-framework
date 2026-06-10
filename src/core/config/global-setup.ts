import { FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

async function globalSetup(config: FullConfig): Promise<void> {
  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('  ║   PW-TS Framework — Global Setup Starting    ║');
  console.log('  ╚══════════════════════════════════════════════╝\n');

  const env = process.env.ENV || 'dev';
  const baseURL = process.env.BASE_URL || config.projects[0]?.use?.baseURL;
  const apiBaseURL = process.env.API_BASE_URL;

  console.log(`  ENV       : ${env}`);
  console.log(`  BASE_URL  : ${baseURL}`);
  console.log(`  API_BASE_URL : ${apiBaseURL}`);
  console.log(`  WORKERS   : ${process.env.WORKERS || '4'}`);
  console.log(`  HEADLESS  : ${process.env.HEADLESS || 'true'}`);
  console.log(`  TAG       : ${process.env.TAG || '(all)'}\n`);

  // Ensure report directories exist
  const dirs = [
    'reports/html',
    'reports/allure-results',
    'reports/junit',
    'reports/test-results',
  ];
  dirs.forEach((dir) => {
    const fullPath = path.resolve(process.cwd(), dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  });

  console.log('  ✓ Report directories initialized');
  console.log('  ✓ Global setup complete\n');
}

export default globalSetup;
