import { render, screen } from '@testing-library/react';
import Footer from './Footer';
import { getCurrentYear, getFooterCopy } from '../utils/utils';

test('It should rendered "copyright 2024 - holberton school" whenever isIndex is set to true', () => {
    render(<Footer />)
  
    const footerParagraph = screen.getByText(`Copyright ${getCurrentYear()} - ${getFooterCopy(true)}`);
  
    expect(footerParagraph).toHaveTextContent(/copyright 2024 - holberton school/i)
});

