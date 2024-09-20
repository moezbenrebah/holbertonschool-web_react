import { render, screen, fireEvent } from '@testing-library/react';
import Notifications from './src/Notifications/Notifications';
import App from './src/App/App';
import { getCurrentYear, getFooterCopy, getLatestNotification } from './src/utils/utils';

describe('App Component', () => {
    beforeEach(() => {
      render(<App />);
    });
  
    test('renders the login form correctly, ignoring case', () => {
      const inputElements = screen.getAllByLabelText(/email|password/i);
      expect(inputElements).toHaveLength(2);

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

test('should contain a <p/> element with specific text, <h1/>, and an <img/>', () => {
    render(<App />)
    
    const paragraphElement = screen.getByText(/login to access the full dashboard/i);
    const footerParagraphElement = screen.getByText(/copyright/i);
    const headingElement = screen.getByRole('heading', {name: /school dashboard/i});
    const imgElement = screen.getByAltText('holberton logo')
  
    expect(paragraphElement).toBeInTheDocument();
    expect(footerParagraphElement).toBeInTheDocument();
    expect(headingElement).toBeInTheDocument();
    expect(imgElement).toBeInTheDocument();
});

test('it should display a title, button and a 3 list items', () => {
  render(<Notifications />)

  const notificationsTitle = screen.getByText('Here is the list of notifications');
  const notificationsButton = screen.getByRole('button');
  const notificationsListItems = screen.getAllByRole('listitem');

  expect(notificationsTitle).toBeInTheDocument();
  expect(notificationsButton).toBeInTheDocument();
  expect(notificationsListItems).toHaveLength(3);
});

test('it should log "Close button has been clicked" whenever the close button is clicked', () => {
  render(<Notifications />);
 
  const notificationsButton = screen.getByRole('button');
  const consoleSpy = jest.spyOn(console, 'log');
  fireEvent.click(notificationsButton);
  expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(/close button has been clicked/i));

  consoleSpy.mockRestore();
})


describe('getCurrentYear', () => {
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