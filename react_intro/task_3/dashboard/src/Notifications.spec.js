import { render, screen, fireEvent } from '@testing-library/react';
import Notifications from './Notifications';
import { getLatestNotification } from './utils';

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

  expect(consoleSpy).toHaveBeenCalledWith('Close button has been clicked');

  consoleSpy.mockRestore();
})