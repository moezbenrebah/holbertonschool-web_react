import subProcess from 'child_process';
import process from 'process';

subProcess.exec('npm run lint', (error) => {
  if (error) {
    process.stdout.write('NOK\n');
  } else {
    process.stdout.write('OK\n');
  }
});
