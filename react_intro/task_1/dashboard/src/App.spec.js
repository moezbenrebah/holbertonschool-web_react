import { render, screen } from '@testing-library/react';
import App from './App.jsx';

test('should contain a <p/> element with specific text, <h1/>, and an <img/>', () => {
  render(<App />);

  const paragraphElement = screen.getByText('Login to access the full dashboard');
  const footerParagraphElement = screen.getByText(/copyright/i);
  // this would accept ("School Dashboard", "school dashboard", "SCHOOL DASHBOARD")
  const headingElement = screen.getByRole('heading', { name: /School dashboard/i });
  // check whether the img tag exists or not, we can't rely on the alt because its value is not specified in the task.
  const imgElement = screen.getByRole('img');

  expect(paragraphElement).toBeInTheDocument();
  expect(footerParagraphElement).toBeInTheDocument();
  expect(headingElement).toBeInTheDocument();
  expect(imgElement).toBeInTheDocument();
});