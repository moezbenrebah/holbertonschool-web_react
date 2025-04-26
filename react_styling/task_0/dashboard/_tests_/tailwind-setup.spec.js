const fs = require('fs');
const path = require('path');
const { basename } = path;

const readFile = (filepath) => {
  try {
    return fs.readFileSync(filepath, 'utf8');
  } catch (error) {
    console.error(`Error reading file ${filepath}:`, error.message);
    return null;
  }
};

const getPackageJson = () => {
  try {
    const content = fs.readFileSync('package.json', 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading package.json:', error.message);
    return null;
  }
};

const fileExists = (filepath) => {
  try {
    return fs.existsSync(filepath);
  } catch (error) {
    return false;
  }
};

describe('Tailwind CSS v4 in Vite React Project Setup', () => {
  test('has correct Tailwind CSS v4 dependencies', () => {
    const packageJson = getPackageJson();
    expect(packageJson).not.toBe(null);

    const tailwindVersion = packageJson.dependencies?.['@tailwindcss/vite'] ||
                            packageJson.devDependencies?.['@tailwindcss/vite'];
    
    expect(tailwindVersion).toBeDefined();
    if (packageJson.dependencies?.tailwindcss || packageJson.devDependencies?.tailwindcss) {
      expect(tailwindVersion.startsWith('4.')).toBe(true);
    }

    const hasViteReactPlugin = packageJson.dependencies?.['@vitejs/plugin-react'] || 
                               packageJson.devDependencies?.['@vitejs/plugin-react'];
    expect(hasViteReactPlugin).toBeDefined();
  });

  test('has correct Vite configuration with Tailwind plugin', () => {
    const viteConfigContent = readFile('vite.config.js');

    expect(viteConfigContent).not.toBe(null);
    
    expect(viteConfigContent).toMatch(/import\s+.*tailwindcss.*from\s+['"]@tailwindcss\/vite['"]/);

    expect(viteConfigContent).toMatch(/import\s+.*react.*from\s+['"]@vitejs\/plugin-react['"]/);

    expect(viteConfigContent).toMatch(/plugins\s*:\s*\[\s*.*(?:tailwindcss|react).*,?\s*.*(?:tailwindcss|react).*\s*\]/s);
  });

  test('has correct CSS setup with tailwindcss import', () => {
    const cssFilePath = './src/main.css';
    const entryFilePath = './src/main.jsx';

    const cssExists = fileExists(cssFilePath);
    expect(cssExists).toBe(true);

    const entryExists = fileExists(entryFilePath);
    expect(entryExists).toBe(true);
    
    const cssContent = readFile(cssFilePath);
    expect(cssContent).not.toBeNull();

    expect(cssContent).toMatch(/@import\s+['"]tailwindcss['"]\s*;/);
    expect(cssContent).not.toMatch(/@tailwind\s+base/);
    expect(cssContent).not.toMatch(/@tailwind\s+components/);
    expect(cssContent).not.toMatch(/@tailwind\s+utilities/);

    const entryContent = readFile(entryFilePath);
    const cssFileName = basename(cssFilePath);
    expect(entryContent).toMatch(new RegExp(`import\\s+['"].*${cssFileName.replace('.', '\\.')}['"]`));
});
  
  test('does not have unnecessary legacy configuration files', () => {
    expect(fileExists('./postcss.config.js')).toBe(false);
      expect(fileExists('tailwind.config.js')).toBe(false)
  });
});
