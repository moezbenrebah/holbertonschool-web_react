console.log('File start');
const originalError = console.error;
const originalWarn = console.warn;

let consoleOutput = [];

console.error = (...args) => {
  console.log('Console.error called:', args);
  consoleOutput.push(['error', args[0]]);
};

console.warn = (...args) => {
  consoleOutput.push(['warn', args[0]]);
};

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
console.log('After RTL import');
import userEvent from '@testing-library/user-event';
import Login from './Login';
console.log('After Login import');
import fs from 'fs';
import path from 'path';

jest.mock('../HOC/WithLogging', () => ({
  __esModule: true,
  default: (Component) => Component,
}));

describe('Login component tests', () => {
  let loginMock;

  beforeEach(() => {
    loginMock = jest.fn();
    consoleOutput = [];
  });

  afterEach(() => {
    jest.clearAllMocks();

    if (consoleOutput.length > 0) {
      throw new Error(
        'Test failed: Console warnings or errors detected:\n' +
        consoleOutput.map(([type, message]) => `${type}: ${message}`).join('\n')
      );
    }
  });

  describe('Form Elements', () => {
    test('testing signin form elements', () => {
      render(<Login {...loginMock}/>);
    
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /ok/i })).toBeInTheDocument();
    });
    
    test('it should check that the email input element will be focused whenever the associated label is clicked', async () => {
      render(<Login {...loginMock}/>)
    
      const emailInput = screen.getByLabelText('Email');
      const emailLabel = screen.getByText('Email');
    
      userEvent.click(emailLabel);
    
      await waitFor(() => {
        expect(emailInput).toHaveFocus();
      });
    })
    
    test('it should check that the password input element will be focused whenver the associated label is clicked', async () => {
      render(<Login {...loginMock}/>)
    
      const passwordLabel = screen.getByText('Password');
      const passwordInput = screen.getByLabelText('Password');
    
      userEvent.click(passwordLabel);
    
      await waitFor(() => {
        expect(passwordInput).toHaveFocus();
      });
    });
    
    test('submit button behavior with different input combinations', () => {
      const props = {
        login: loginMock,
        isLoggedIn: false
      };
  
      render(<Login {...props} />);
      
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByText('OK');

      expect(submitButton).toBeDisabled();
      expect(emailInput.value).toBe('');
      expect(passwordInput.value).toBe('');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: '123' } });
      expect(submitButton).toBeDisabled();
    
      fireEvent.change(emailInput, { target: { value: 'test.com' } });
      fireEvent.change(passwordInput, { target: { value: '12345678' } });
      expect(submitButton).toBeDisabled();

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: '12345678' } });
      expect(submitButton).not.toBeDisabled();
    });

    test('should call logIn function on form submission with correct values', () => {
      render(<Login login={loginMock} />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const form = screen.getByRole('form');
      
      fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.submit(form);
    
      expect(loginMock).toHaveBeenCalledWith('test@test.com', 'password123');
    });
  });

  describe('Login Component State Management', () => {
    test('state updates correctly with input changes and submit button state', () => {
      render(<Login login={loginMock} />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /ok/i });

      fireEvent.change(emailInput, { target: { value: 'newemail@test.com' } });
      fireEvent.change(passwordInput, { target: { value: 'newpassword' } });
  
      expect(emailInput.value).toBe('newemail@test.com');
      expect(passwordInput.value).toBe('newpassword');
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('Login Component Implementation', () => {
    test('Login is implemented as a functional component', () => {
      const content = fs.readFileSync(
        path.resolve(__dirname, './Login.jsx'), 
        'utf8'
      );
  
      const loginDefinition = content.match(/function Login\s*\([^)]*\)|const Login\s*=\s*\([^)]*\)\s*=>/);
      const hasHooks = content.includes('useState');
      const noClassImplementation = !content.match(/class Login extends/);
  
      expect(loginDefinition).toBeTruthy();
      expect(hasHooks).toBe(true);
      expect(noClassImplementation).toBe(true);
    });
  });
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});