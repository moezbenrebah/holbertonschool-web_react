// replaceNotificationsWithEmpty.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const appJsxPath = path.join(__dirname, 'src', 'App', 'App.jsx');

if (!fs.existsSync(appJsxPath)) {
  console.error('App.jsx file not found');
  process.exit(1);
}

let content = fs.readFileSync(appJsxPath, 'utf8');

function replaceNotificationsListInJSX(jsxContent) {
  const notificationsRegex = /(<Notifications[^>]*notifications=\{)([^}]+)(\}[^>]*\/>)/g;
  
  let replaced = false;
  const newContent = jsxContent.replace(notificationsRegex, (match, prefix, notificationsProp, suffix) => {
    replaced = true;
    return `${prefix}[]${suffix}`;
  });
  
  return { newContent, replaced };
}

const { newContent, replaced } = replaceNotificationsListInJSX(content);

if (replaced) {
  fs.writeFileSync(appJsxPath, newContent);
  console.log('Successfully replaced notifications list with empty array');
} else {
  console.log('Could not find Notifications notifications prop');
}
