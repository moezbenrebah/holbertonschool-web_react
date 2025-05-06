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

	const renderMethodIndex = fileContent.indexOf('render() {');
	if (renderMethodIndex === -1) return;

	const consoleLogLine = 'console.log(`Rendering NotificationItem with id: ${this.props.id}, type: ${this.props.type}, value: ${this.props.value}`);';

	const openingBraceIndex = fileContent.indexOf('{', renderMethodIndex);

	if (openingBraceIndex === -1) return;

	const beforeBrace = fileContent.slice(0, openingBraceIndex + 1);
	const afterBrace = fileContent.slice(openingBraceIndex + 1);

	const newContent = `${beforeBrace}\n    ${consoleLogLine}\n${afterBrace}`;

	fs.writeFileSync(NotificationItemFilePath, newContent, 'utf8');
})();

(function runTests() {
	exec('jest --config=package.json ./test.spec.js', (error, stdout, stderr) => {
		if (error) {
			if (error.code === 1) {
				process.stdout.write(stdout);
				process.stdout.write(stderr);
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
})()

