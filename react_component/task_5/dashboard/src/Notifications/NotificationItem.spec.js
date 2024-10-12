import React from 'react';
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

describe('NotificationItem - Pure Component behavior', () => {
  const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
  let markAsRead;

  beforeEach(() => {
    jest.clearAllMocks();
    markAsRead = jest.fn();
  });

  test('should re-render when props change', () => {

    const { rerender } = render(
      <NotificationItem
        id={1}
        type="urgent"
        value="New notification"
        markAsRead={markAsRead}
      />
    );

    expect(mockConsoleLog).toHaveBeenCalledWith('Rendering NotificationItem with id: 1, type: urgent, value: New notification');
    expect(mockConsoleLog).toHaveBeenCalledTimes(1);

    rerender(
      <NotificationItem
        id={1}
        type="urgent"
        value="Updated notification"
        markAsRead={markAsRead}
      />
    );

    expect(mockConsoleLog).toHaveBeenCalledWith('Rendering NotificationItem with id: 1, type: urgent, value: Updated notification');
    expect(mockConsoleLog).toHaveBeenCalledTimes(2);
  });

  test('should not re-render when props do not change', () => {
    const { rerender } = render(
      <NotificationItem
        id={1}
        type="urgent"
        value="New notification"
        markAsRead={markAsRead}
      />
    );

    expect(mockConsoleLog).toHaveBeenCalledWith('Rendering NotificationItem with id: 1, type: urgent, value: New notification');
    expect(mockConsoleLog).toHaveBeenCalledTimes(1);

    rerender(
      <NotificationItem
        id={1}
        type="urgent"
        value="New notification"
        markAsRead={markAsRead}
      />
    );

    expect(mockConsoleLog).toHaveBeenCalledWith('Rendering NotificationItem with id: 1, type: urgent, value: New notification');
    expect(mockConsoleLog).toHaveBeenCalledTimes(1);
  });
});

test('should return true if the NotificationItem component is a class component', () => {
  const props = Object.getOwnPropertyNames(NotificationItem.prototype);
  const isClassComponent = NotificationItem.prototype.__proto__ === React.PureComponent.prototype;
  const inheritsFromReactComponent = Object.getPrototypeOf(NotificationItem.prototype) === React.PureComponent.prototype;
  
  expect(props).toContain('constructor');
  expect(isClassComponent).toBe(true);
  expect(inheritsFromReactComponent).toBe(true);
})
