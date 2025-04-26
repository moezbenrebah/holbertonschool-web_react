import { test, expect } from '@playwright/test';

test('Roboto font ', async ({ page }) => {
  const fontRequests = [];
  
  // listen for network requests before navigation (new & old browsers covered)
  await page.route('**/*.woff2', route => {
    if (route.request().url().includes('roboto')) {
      fontRequests.push(route.request());
    }
    return route.continue();
  });

  await page.route('**/*.woff', route => {
    if (route.request().url().includes('roboto')) {
      fontRequests.push(route.request());
    }
    return route.continue();
  });

  await page.goto('/');
  
  await page.waitForLoadState('networkidle');

  expect(fontRequests.length).toBeGreaterThan(0);
  expect(fontRequests.some(req => req.url().includes('roboto'))).toBe(true);
});

test('Roboto font weights 400, 500, and 700 are loaded', async ({ page }) => {
  const cssRequests = [];
  
  // listen for all CSS requests
  await page.route('**/*.css', route => {
    const url = route.request().url();
    cssRequests.push(url);
    return route.continue();
  });

  await page.goto('/');

  await page.waitForLoadState('networkidle');

  const has400 = cssRequests.some(url => 
    url.includes('@fontsource/roboto') && 
    (url.includes('/400.css') || url.endsWith('400.css'))
  );
  
  const has500 = cssRequests.some(url => 
    url.includes('@fontsource/roboto') && 
    (url.includes('/500.css') || url.endsWith('500.css'))
  );
  
  const has700 = cssRequests.some(url => 
    url.includes('@fontsource/roboto') && 
    (url.includes('/700.css') || url.endsWith('700.css'))
  );

  expect(has400).toBe(true);
  expect(has500).toBe(true);
  expect(has700).toBe(true);
});
