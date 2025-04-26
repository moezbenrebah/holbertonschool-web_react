import { exec } from 'child_process';
import process from 'process';

const cmd = 'npx playwright test e2e-tests/App.spec.js --config=playwright.config.js';

exec(cmd, (err, stdout, stderr) => {
  const failureIndicators = [
    /\d+ failed/i,
    /^\s*✘/m,
    /Timeout of \d+ms exceeded/i,
    /Error:/i
  ];

  const outputCombined = stdout + stderr;

  const hasFailure = failureIndicators.some(pattern => pattern.test(outputCombined));

  if (hasFailure || err) {
    process.stdout.write('NOK\n');
  } else {
    process.stdout.write('OK\n');
  }
});
