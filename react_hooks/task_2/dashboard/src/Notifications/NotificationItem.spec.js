import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NotificationItem from './NotificationItem';
import { getLatestNotification } from '../utils/utils';


// Basic rendering and functionality tests
describe('NotificationItem - Basic Functionality', () => {
  test('renders without crashing', () => {
    render(<NotificationItem />);
  });

  test('displays urgent notification with red color', () => {
    const props = {
      type: 'urgent',
      html: { __html: getLatestNotification() },
    };
    render(<NotificationItem {...props} />);
    const liElement = screen.getByRole('listitem');
    expect(liElement).toHaveStyle({ color: 'red' });
    expect(liElement).toHaveAttribute('data-notification-type', 'urgent');
  });

  test('displays default notification with blue color', () => {
    const props = {
      type: 'default',
      value: 'Test notification',
    };
    render(<NotificationItem {...props} />);
    const liElement = screen.getByRole('listitem');
    expect(liElement).toHaveStyle({ color: 'blue' });
    expect(liElement).toHaveAttribute('data-notification-type', 'default');
  });

  test('calls markAsRead with correct id on click', () => {
    const mockMarkAsRead = jest.fn();
    const id = 1;
    render(<NotificationItem id={id} markAsRead={mockMarkAsRead} />);
    const listItem = screen.getByRole('listitem');
    fireEvent.click(listItem);
    expect(mockMarkAsRead).toHaveBeenCalledWith(id);
  });

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
});

// The NotificationItem is a function component
test('should return true if the NotificationItem component is a functional component', () => {
  expect(typeof NotificationItem.type).toBe('function');
  expect(NotificationItem.$$typeof.toString()).toBe('Symbol(react.memo)');
  expect(NotificationItem.type.prototype?.isReactComponent).toBeUndefined();
});

// React.memo specific tests
describe('NotificationItem - Memo Behavior', () => {
  let renderCount;
  const mockConsoleLog = jest.fn();

  beforeEach(() => {
    renderCount = 0;
    jest.spyOn(console, 'log').mockImplementation((msg) => {
      if (typeof msg === 'string' && msg.includes('Rendering NotificationItem')) {
        renderCount++;
      }
      mockConsoleLog(msg);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('verifies component is wrapped with React.memo', () => {
    expect(NotificationItem.$$typeof.toString()).toBe('Symbol(react.memo)');
    expect(NotificationItem.type).toBeInstanceOf(Function);
  });

  test('prevents re-render with same props', () => {
    const markAsRead = jest.fn();
    const initialProps = {
      id: 1,
      type: 'urgent',
      value: 'Test notification',
      markAsRead,
    };

    const { rerender } = render(<NotificationItem {...initialProps} />);
    expect(renderCount).toBe(1);

    rerender(<NotificationItem {...initialProps} />);
    expect(renderCount).toBe(1); // should not increment
  });

  test('allows re-render when props change', () => {
    const markAsRead = jest.fn();
    const { rerender } = render(
      <NotificationItem
        id={1}
        type="urgent"
        value="Original notification"
        markAsRead={markAsRead}
      />
    );
    expect(renderCount).toBe(1);

    rerender(
      <NotificationItem
        id={1}
        type="urgent"
        value="Updated notification"
        markAsRead={markAsRead}
      />
    );
    expect(renderCount).toBe(2); // should increment
  });
});
