import { FullConfig } from '@playwright/test';

async function globalTeardown(_config: FullConfig): Promise<void> {
  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║  PW-TS Framework — Global Teardown Complete  ║');
  console.log('╚══════════════════════════════════════════════╝\n');
}

export default globalTeardown;
