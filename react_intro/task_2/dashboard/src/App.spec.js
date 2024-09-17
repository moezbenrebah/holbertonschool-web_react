import {render, screen} from "@testing-library/react"
import App from "/home/moez/Documents/React_New_Version/vite_react/ForLocalTest/holbertonschool-web_react/react_intro/task_2/dashboard/app-test-seq3.jsx";


test('renders School Dashboard heading', () => {
    render(<App />);
    const headingElement = screen.getByRole('heading', { name: /School dashboard/i });
    expect(headingElement).toBeInTheDocument();

  });

  test('renders App body text', () => {
    render(<App />);
    const bodyElement = screen.getByText(/Login to access the full dashboard/i);
    expect(bodyElement).toBeInTheDocument();
  });

  test('renders App img', () => {
    render(<App />);
    const imgElement = screen.getByAltText(/holberton logo/i);
    expect(imgElement).toBeInTheDocument();
  });

  test('renders 2 input elements', () => {
    render(<App />);
    const inputElements = screen.getByLabelText(/email/i);
    const passwordInputs = screen.getByLabelText(/password/i);
    expect(inputElements).toBeInTheDocument()
    expect(passwordInputs).toBeInTheDocument()
  });

  test('renders 2 label elements with text Email and Password', () => {
    render(<App />);
    const emailInput = screen.getByText(/email?:/i);
    const passwordInput = screen.getByText(/password?:/i);
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });

  test('renders a button with the text OK', () => {
    render(<App />);
    const buttonElement = screen.getByRole('button', { name: /ok/i });
    expect(buttonElement).toBeInTheDocument();
  });
