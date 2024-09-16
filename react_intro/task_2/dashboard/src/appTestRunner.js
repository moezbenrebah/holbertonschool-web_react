import subProcess from 'child_process';
import process from 'process';

const cmd = `jest ./appTest.spec.js`;

subProcess.exec(cmd, (err, stdout, stderr) => {
  if (err) {
    if (err.code === 1) {
      process.stdout.write('NOK\n');
      return;
    } else {
      const hasFail = stderr.split('\n').some(line => line.includes('FAIL'));
      if (hasFail) {
        process.stdout.write('NOK\n');
      } else {
        process.stdout.write('OK\n');
      }
      return;
    }
  }

  const hasFail = stdout.split('\n').some(line => line.includes('FAIL'));
  if (hasFail) {
    process.stdout.write('NOK\n');
  } else {
    process.stdout.write('OK\n');
  }
});