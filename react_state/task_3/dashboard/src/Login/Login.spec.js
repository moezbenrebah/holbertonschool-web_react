import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import Login from './Login';

test('testing signin form elements', () => {
  render(<Login />);

  const inputElements = screen.getAllByLabelText(/email|password/i);
  const emailLabelElement = screen.getByLabelText(/email/i);
  const passwordLabelElement = screen.getByLabelText(/password/i);
  const buttonElementText = screen.getByRole('button', { name: 'OK' })

  expect(inputElements).toHaveLength(2)
  expect(emailLabelElement).toBeInTheDocument()
  expect(passwordLabelElement).toBeInTheDocument()
  expect(buttonElementText).toBeInTheDocument()
});

test('it should check that the email input element will be focused whenever the associated label is clicked', async () => {
  render(<Login />)

  const emailInput = screen.getByLabelText('Email');
  const emailLabel = screen.getByText('Email');

  userEvent.click(emailLabel);

  await waitFor(() => {
    expect(emailInput).toHaveFocus();
  });
})

test('it should check that the password input element will be focused whenver the associated label is clicked', async () => {
  render(<Login />)

  const passwordLabel = screen.getByText('Password');
  const passwordInput = screen.getByLabelText('Password');

  userEvent.click(passwordLabel);

  await waitFor(() => {
    expect(passwordInput).toHaveFocus();
  });
});

test('submit button is disabled by default', () => {
  render(<Login />);

  const submitButton = screen.getByRole('button', { name: 'OK' });

  expect(submitButton).toBeDisabled();
});

test('submit button is enabled after entering valid email and password', async () => {
  const user = userEvent.setup();
  render(<Login />);

  const emailInput = screen.getByLabelText('Email');
  const passwordInput = screen.getByLabelText('Password');
  const submitButton = screen.getByRole('button', { name: 'OK' });

  // Initially disabled
  expect(submitButton).toBeDisabled();

  // Type valid email (must be valid format)
  await user.type(emailInput, 'test@example.com');

  // Still disabled (password not valid yet)
  expect(submitButton).toBeDisabled();

  // Type valid password (at least 8 characters)
  await user.type(passwordInput, 'password123');

  // Now enabled
  await waitFor(() => {
    expect(submitButton).toBeEnabled();
  });
});

test('logIn method is called with email and password when form is submitted', async () => {
  const user = userEvent.setup();
  const mockLogIn = jest.fn();

  render(<Login logIn={mockLogIn} />);

  const emailInput = screen.getByLabelText('Email');
  const passwordInput = screen.getByLabelText('Password');
  const submitButton = screen.getByRole('button', { name: 'OK' });

  // Type valid email and password
  await user.type(emailInput, 'test@example.com');
  await user.type(passwordInput, 'password123');

  // Wait for button to be enabled
  await waitFor(() => {
    expect(submitButton).toBeEnabled();
  });

  // Submit the form
  await user.click(submitButton);

  // Verify logIn was called with correct arguments
  expect(mockLogIn).toHaveBeenCalledTimes(1);
  expect(mockLogIn).toHaveBeenCalledWith('test@example.com', 'password123');
});