import { render, screen, fireEvent } from '@testing-library/react';
import NotificationItem from './NotificationItem';
import { getLatestNotification } from '../utils/utils';

test('the NotificationItem is rendered without crashing', () => {
  render(<NotificationItem />)
})

test('it should display the correct notification with a red color, and set the "data-notification-type" to urgent whenever it receives the type "urgent" props', () => {
  const props = {
    type: 'urgent',
    html: {__html: getLatestNotification()},
  }

  render(<NotificationItem {...props} />);

  const liElement = screen.getByRole('listitem');

  expect(liElement).toHaveStyle({ color: 'red' });
  expect(liElement).toHaveAttribute('data-notification-type', 'urgent');
});

test('it should display the correct notification with a blue color, and set the "data-notification-type" to default whenever it receives the type "default" props', () => {
  const props = {
    type: 'default',
    html: undefined,
  }

  render(<NotificationItem {...props} />);

  const liElement = screen.getByRole('listitem');

  expect(liElement).toHaveStyle({ color: 'blue' });
  expect(liElement).toHaveAttribute('data-notification-type', 'default');
});

test('it should log to the console the "Notification id has been marked as read" with the correct notification item id', () => {
  const mockMarkAsRead = jest.fn()
  
  render(<NotificationItem markAsRead={mockMarkAsRead} />);

  const firstListItemElement = screen.getAllByRole('listitem')[0];

  fireEvent.click(firstListItemElement)

  expect(mockMarkAsRead).toHaveBeenCalled()
});
