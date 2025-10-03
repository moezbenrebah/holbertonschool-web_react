import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NotificationItemFilePath = path.join(__dirname, 'src', 'Notifications', 'NotificationItem.jsx');

(function addConsoleLogInRender() {
  if (!fs.existsSync(NotificationItemFilePath)) return;
  
  const fileContent = fs.readFileSync(NotificationItemFilePath, 'utf8');
  const consoleLogLine = 'console.log(`Rendering NotificationItem with id: ${id}, type: ${type}, value: ${value}`);';

  const patterns = [
    {
      regex: /memo\(\s*\(\s*{\s*[^}]+}\s*\)\s*=>\s*{/,
      getPosition: (match) => match.index + match[0].length
    },

    {
      regex: /memo\(\s*function\s+NotificationItem\s*\(\s*{\s*[^}]+}\s*\)\s*{/,
      getPosition: (match) => match.index + match[0].length
    },

    {
      regex: /function\s+NotificationItemComponent\s*\(\s*{\s*[^}]+}\s*\)\s*{/,
      getPosition: (match) => match.index + match[0].length
    },

    {
      regex: /memo\(\s*\(\s*{\s*[^}]+}\s*\)\s*=>\s*{/,
      getPosition: (match) => match.index + match[0].length
    }
  ];

  let updatedContent = fileContent;
  let matchFound = false;

  for (const pattern of patterns) {
    const match = pattern.regex.exec(fileContent);
    if (match) {
      const insertPosition = pattern.getPosition(match);
      
      // inject the console.log after the opening brace
      updatedContent = [
        fileContent.slice(0, insertPosition),
        '\n  ' + consoleLogLine + '\n',
        fileContent.slice(insertPosition)
      ].join('');
      
      matchFound = true;
      break;
    }
  }

  if (matchFound && updatedContent !== fileContent) {
    try {
      fs.writeFileSync(NotificationItemFilePath, updatedContent, 'utf8');
    } catch (error) {
      console.error('Error writing to file:', error);
    }
  } else {
    console.log('No matching component pattern found or console.log already exists');
  }
})();

(function runTests() {
	exec('jest --config=package.json ./src', (error, stdout, stderr) => {
		if (error) {
			if (error.code === 1) {
				process.stdout.write('NOK\n');
				process.stdout.write(stdout);
				process.stdout.write(stderr);
				return;
		} else {
			const hasFail = stderr.split('\n').some(line => line.includes('FAIL'));
			if (hasFail) {
				process.stdout.write('NOK\n');
                process.stdout.write(stdout);
				process.stdout.write(stderr);
			} else {
				process.stdout.write('OK\n');
			}
			return;
		}
	}
		
	const hasFail = stdout.split('\n').some(line => line.includes('FAIL'));
		if (hasFail) {
			process.stdout.write('NOK\n');
            process.stdout.write(stdout);
			process.stdout.write(stderr);
		} else {
			process.stdout.write('OK\n');
		}
	});
})()