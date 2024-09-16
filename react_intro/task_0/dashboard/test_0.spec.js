import { render, screen } from '@testing-library/react';
import App from './src/App';

test('should contain a <p/> element with specific text, <h1/>, and an <img/>', () => {
  render(<App />);

  const currentYear = new Date().getFullYear();
  const regex = new RegExp(`copyright ${currentYear} - holberton school`, 'i');

  const paragraphElement = screen.getByText(/login to access the full dashboard/i);
  const footerParagraphElement = screen.getByText(regex);
  const headingElement = screen.getByRole('heading', { name: /school dashboard/i });
  const imgElement = screen.getByRole('img');

  expect(paragraphElement).toBeInTheDocument();
  expect(footerParagraphElement).toBeInTheDocument();
  expect(headingElement).toBeInTheDocument();
  expect(imgElement).toBeInTheDocument();
});
