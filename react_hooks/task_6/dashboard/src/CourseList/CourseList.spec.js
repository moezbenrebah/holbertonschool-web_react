import React from 'react';
import axios from 'axios';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App/App';

jest.mock('axios');

describe('CourseList Component', () => {

  test('renders 5 different rows when user is logged in', async () => {
    // Mock both notifications and courses endpoints
    axios.get.mockImplementation((url) => {
      if (url.includes('notifications.json')) {
        return Promise.resolve({
          data: {
            notifications: [
              { id: 1, type: 'default', value: 'New course available' },
              { id: 2, type: 'urgent', value: 'New resume available' },
              { id: 3, type: 'urgent', html: { __html: '' } },
            ],
          },
        });
      }
      if (url.includes('courses.json')) {
        return Promise.resolve({
          data: {
            courses: [
              { id: 1, name: 'ES6', credit: 60 },
              { id: 2, name: 'Webpack', credit: 20 },
              { id: 3, name: 'React', credit: 40 },
            ],
          },
        });
      }
      return Promise.resolve({ data: {} });
    });

    render(<App />);

    // Simulate login
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /ok/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    // Wait for courses to be fetched and rendered
    await waitFor(() => {
      expect(screen.getByText('ES6')).toBeInTheDocument();
    });

    // Check if the course list is displayed with the correct number of rows
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(5); // 2 header rows and 3 course rows
});
});
