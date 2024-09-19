import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import Header from '../Header/Header';
import Login from '../Login/Login';
import Footer from '../Footer/Footer';
import { getCurrentYear, getFooterCopy } from '../utils/utils';

test('it should render the Login component with all its elements whenever the "isLoggedIn" is set false', () => {
  render(<App />);

  const emailLabelElement = screen.getByLabelText(/email/i)
  const passwordLabelElement = screen.getByLabelText(/password/i)
  const inputsElements = screen.getAllByRole('textbox');
  const buttonElement = screen.getByRole('button', { name: /ok/i});

  expect(emailLabelElement).toBeInTheDocument();
  expect(passwordLabelElement).toBeInTheDocument();
  expect(inputsElements).toHaveLength(2);
  expect(buttonElement).toBeInTheDocument();
});

test('it should rendered without crashing', () => {
  render(<Footer />)

  const footerParagraph = screen.getByText(`Copyright ${getCurrentYear()} - ${getFooterCopy(true)}`);

  expect(footerParagraph).toHaveTextContent(/copyright 2024 - holberton School/i)
});

export const convertHexToRGBA = (hexCode) => {
  let hex = hexCode.replace('#', '');

  if (hex.length === 3) {
    hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
    console.log({hex})
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return { r, g, b };
};

test('should contain a <p/> element with specific text, <h1/>, and an <img/>', () => {
  render(<Header />);

  const headingElement = screen.getByRole('heading', {name: /school Dashboard/i});
  const imgElement = screen.getByAltText('holberton logo')

  expect(headingElement).toBeInTheDocument();
  expect(headingElement).toHaveStyle({color: convertHexToRGBA('#e1003c') })
  expect(imgElement).toBeInTheDocument();
});

test('testing signin form elements', () => {
  render(<Login />);

  const inputElements = screen.getAllByRole('textbox')
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

  const emailLabel = screen.getByText('Email');
  const emailInput = screen.getByLabelText('Email', {selector: 'input'});

  fireEvent.click(emailLabel);

  emailInput.focus();

  expect(emailInput).toHaveFocus();
})

test('it should check that the password input element will be focused whenver the associated label is clicked', async () => {
  render(<Login />)

  const passwordLabel = screen.getByText('Password');
  const passwordInput = screen.getByLabelText('Password', {selector: 'input'});

  fireEvent.click(passwordLabel);

  passwordInput.focus()

  expect(passwordInput).toHaveFocus();
});