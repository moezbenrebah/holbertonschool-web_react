import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

describe('App Component', () => {
  beforeEach(() => {
    render(<App />);
  });

  test('renders the login form correctly, ignoring case', () => {
    const inputElements = screen.getAllByLabelText(/email|password/i);
    expect(inputElements).toHaveLength(2);

    expect(screen.getByText(/login to access the full dashboard/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ok/i })).toBeInTheDocument();
  });

  test('button renders correctly and is clickable, ignoring case', async () => {
    const button = screen.getByRole('button', { name: /ok/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });
});