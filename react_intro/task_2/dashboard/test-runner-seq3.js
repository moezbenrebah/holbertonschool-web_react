import fs from 'fs';
import babelParser from '@babel/parser';
import _traverse from "@babel/traverse";
const traverse = _traverse.default;

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const patterns = {
  emailLabel: /email/i,
  passwordLabel: /password/i,
  button: /^ok$/i
};

const testFilePath = path.join(__dirname, './src/App.spec.js');
const testFileContent = fs.readFileSync(testFilePath, 'utf-8');
const ast = babelParser.parse(testFileContent, {
  sourceType: 'module',
  plugins: ['jsx'],
});

let hasEmailLabelTest = false;
let hasPasswordLabelTest = false;
let hasButtonTest = false;

// Helper function to extract callee
function getCalleeName(calleeNode) {
  if (calleeNode.type === 'MemberExpression') {
    if (calleeNode.object.type === 'Identifier' && calleeNode.property.type === 'Identifier') {
      return `${calleeNode.object.name}.${calleeNode.property.name}`;
    }
  }
  return calleeNode.name || undefined;
}

// Traverse the AST
traverse(ast, {
  CallExpression(path) {
    const callee = getCalleeName(path.node.callee);
    const args = path.node.arguments;

    if (args.length > 0) {
      let argValue;

      if (args[0].type === 'StringLiteral') {
        argValue = args[0].value;
      } else if (args[0].type === 'RegExpLiteral') {
        argValue = args[0].pattern;
      }

      if (callee === 'screen.getAllByLabelText') {
        if (patterns.emailLabel.test(argValue)) hasEmailLabelTest = true;
        if (patterns.passwordLabel.test(argValue)) hasPasswordLabelTest = true;
      }

      if (callee === 'screen.getByLabelText') {
        if (patterns.emailLabel.test(argValue)) hasEmailLabelTest = true;
        if (patterns.passwordLabel.test(argValue)) hasPasswordLabelTest = true;
      }

      if (callee === 'screen.getByRole' && args.length > 1) {
        if (args[0].type === 'StringLiteral' && args[0].value === 'button') {
          const RegexNameOption = args[1].properties.find(
            prop => prop.key.name === 'name' && prop.value.type === 'RegExpLiteral'
          );
      
          const literalNameOption = args[1].properties.find(
            prop => prop.key.name === 'name' && prop.value.type === 'StringLiteral'
          );
      
          const regexMatch = RegexNameOption && patterns.button.test(RegexNameOption.value.pattern);
          const literalMatch = literalNameOption && literalNameOption.value === 'OK' || 'ok';
      
          if (regexMatch || literalMatch) {
            hasButtonTest = true;
          }
        }
      }
    }
  },
});

if (!hasEmailLabelTest || !hasPasswordLabelTest || !hasButtonTest) {
  console.log('NOK');
} else {
  console.log('OK');
}