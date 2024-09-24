// import React from 'react';
// import { render } from '@testing-library/react';
// import App from './App';
// import * as utils from './utils';

// test('should call the pure JavaScript function indirectly', () => {
//   // Create a spy on the pure JavaScript function
//   const spyGetFullYear = jest.spyOn(Date.prototype, 'getFullYear');
//   const spyGetFooterCopy = jest.spyOn(utils, 'getFooterCopy');
//   const spyGetLatestNotification = jest.spyOn(utils, 'getLatestNotification')

//   // Render the component
//   render(<App />);

//   // Verify the behavior of the pure JavaScript function indirectly
//   expect(spyGetFullYear).toHaveBeenCalled();
//   expect(spyGetFooterCopy).toHaveBeenCalled();
//   expect(spyGetLatestNotification).toHaveBeenCalled();

//   // Restore the original function
//   spyGetFullYear.mockRestore();
//   spyGetFooterCopy.mockRestore();
//   spyGetLatestNotification.mockRestore();
// });

import { getCurrentYear, getFooterCopy, getLatestNotification } from './utils';

describe('getFullyYear', () => {
  it('returns the current year', () => {
    const currentYear = new Date().getFullYear();
    expect(getCurrentYear()).toBe(currentYear);
  });
});

describe('getFooterCopy', () => {
  it('returns the footer copy for the index page', () => {
    const isIndex = true;
    const footerCopy = getFooterCopy(isIndex);
    expect(footerCopy).toBe('Holberton School');
  });

  it('returns the footer copy for non-index pages', () => {
    const isIndex = false;
    const footerCopy = getFooterCopy(isIndex);
    expect(footerCopy).toBe('Holberton School main dashboard');
  });
});

describe('getLatestNotification', () => {
  it('returns the latest notification', () => {
    const latestNotification = getLatestNotification();
    expect(latestNotification).toBe(
      '<strong>Urgent requirement</strong> - complete by EOD'
    );
  });
});
