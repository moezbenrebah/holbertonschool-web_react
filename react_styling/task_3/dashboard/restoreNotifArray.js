// restoreNotificationsList.js
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

const defaultNotificationsArray = 'notificationsList';

function restoreNotificationsListInJSX(jsxContent) {
  const emptyNotificationsRegex = /(<Notifications[^>]*notifications=\{)\[\](\}[^>]*\/>)/g;
  
  let restored = false;
  const restoredContent = jsxContent.replace(emptyNotificationsRegex, (match, prefix, suffix) => {
    restored = true;
    return `${prefix}${defaultNotificationsArray}${suffix}`;
  });

  return { restoredContent, restored };
}

const { restoredContent, restored } = restoreNotificationsListInJSX(content);

if (restored) {
  fs.writeFileSync(appJsxPath, restoredContent);
  console.log('Successfully restored notifications list');
} else {
  console.log('Could not find empty notifications array in App.jsx');
}
