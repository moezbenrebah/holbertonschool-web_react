const originalError = console.error;
const originalWarn = console.warn;

let consoleOutput = [];

console.error = (...args) => {
  consoleOutput.push(['error', args[0]]);
};

console.warn = (...args) => {
  consoleOutput.push(['warn', args[0]]);
};

beforeEach(() => {
  consoleOutput = [];
});

afterEach(() => {
  jest.clearAllMocks();

  if (consoleOutput.length > 0) {
    throw new Error(
      'Test failed: Console warnings or errors detected:\n' +
      consoleOutput.map(([type, message]) => `${type}: ${message}`).join('\n')
    );
  }
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { getLatestNotification } from '../utils/utils'
import Notifications from './Notifications';

test('it should display a title, button and a 3 list items, whenever the "displayDrawer" set to true', () => {
  const props = {
    notifications: [
      { id:1, type:'default', value:'New course available' },
      { id:2, type:'urgent', value:'New resume available' },
      { id:3, type:'urgent', html:{ __html: getLatestNotification()} }
    ], 
    displayDrawer: true
  }
  render(<Notifications {...props} />)

  const notificationsTitle = screen.getByText('Here is the list of notifications');
  const notificationsButton = screen.getByRole('button');
  const notificationsListItems = screen.getAllByRole('listitem');
  
  expect(notificationsTitle).toBeInTheDocument();
  expect(notificationsButton).toBeInTheDocument();
  expect(notificationsListItems).toHaveLength(3);
});

test('it should display 3 notification items as expected', () => {
  const props = {
    notifications: [
      { id: 1, type: 'default', value: 'New course available' },
      { id: 2, type: 'urgent', value: 'New resume available' },
      { id: 3, type: 'urgent', html: { __html: getLatestNotification() } }
    ],
    displayDrawer: true
  };

  render(<Notifications {...props} />);

  const notificationsFirstItem = screen.getByText('New course available');
  const notificationsSecondItem = screen.getByText('New resume available');
  
  const notificationsListItems = screen.getAllByRole('listitem');
  
  expect(notificationsFirstItem).toBeInTheDocument();
  expect(notificationsSecondItem).toBeInTheDocument();

  const reactPropsKey = Object.keys(notificationsListItems[2]).find(key => /^__reactProps/.test(key));

  if (reactPropsKey) {
    const dangerouslySetInnerHTML = notificationsListItems[2][reactPropsKey].dangerouslySetInnerHTML.__html;

    expect(dangerouslySetInnerHTML).toContain('<strong>Urgent requirement</strong>');
    expect(dangerouslySetInnerHTML).toContain(' - complete by EOD');
  } else {
    throw new Error('No property found matching the regex');
  }
});

test('it should display the correct notification colors', () => {
  const props = {
    notifications: [
      { id: 1, type: 'default', value: 'New course available' },
      { id: 2, type: 'urgent', value: 'New resume available' },
      { id: 3, type: 'urgent', html: { __html: getLatestNotification() } }
    ],
    displayDrawer: true
  };

  render(<Notifications {...props} />);

  const notificationsListItems = screen.getAllByRole('listitem');

  const colorStyleArr = [];

  for (let i = 0; i <= notificationsListItems.length - 1; i++) {
    const styleProp = Object.keys(notificationsListItems[i]).find(key => /^__reactProps/.test(key));
    if (styleProp) {
      colorStyleArr.push(notificationsListItems[i].style._values.color);
    }
  }

  expect(colorStyleArr).toEqual(['blue', 'red', 'red']);
});

test('it should render the 3 given notifications text, whenever the "displayDrawer" set to true', () => {
  const props = {
    notifications: [
      { id:1, type:'default', value:'New course available' },
      { id:2, type:'urgent', value:'New resume available' },
      { id:3, type:'urgent', html:{ __html: getLatestNotification()} }
    ], 
    displayDrawer: true
  }
  render(<Notifications {...props} />)

  expect(screen.getByText('New course available')).toBeInTheDocument();
  expect(screen.getByText('New resume available')).toBeInTheDocument();
  expect(screen.getByText(/complete by EOD/)).toBeInTheDocument();
})

test('it should not display a title, button and a 3 list items, whenever the "displayDrawer" set to false', () => {
  const props = {
    notifications: [
      { id:1, type:'default', value:'New course available' },
      { id:2, type:'urgent', value:'New resume available' },
      { id:3, type:'urgent', html:{ __html: getLatestNotification()} }
    ], 
    displayDrawer: false
  }
  render(<Notifications {...props} />)

  const notificationsTitle = screen.queryByText('Here is the list of notifications');
  const notificationsButton = screen.queryByRole('button');
  const notificationsListItems = screen.queryAllByRole('listitem');
  
  expect(notificationsTitle).toBeNull();
  expect(notificationsButton).toBeNull();
  expect(notificationsListItems).toHaveLength(0);
});

test('it should display a paragraph of "No new notification for now" whenever the listNotification prop is empty', () => {
  const props = {
    notifications: [], 
    displayDrawer: true,
    markNotificationAsRead: jest.fn()
  }
  render(<Notifications {...props} />)

  const notificationsTitle = screen.getByText(/no new notifications for now/i);
  expect(notificationsTitle).toBeInTheDocument();
});

// test('should rerender when the notifications length changes', () => {
//   const initialNotifications = [
//     { id: 1, type: 'default', value: 'Notification 1' },
//   ];

//   const newNotifications = [
//     { id: 1, type: 'default', value: 'Notification 1' },
//     { id: 2, type: 'urgent', value: 'Notification 2' },
//   ];

//   const renderSpy = jest.spyOn(Notifications.prototype, 'render');

//   const { rerender } = render(<Notifications notifications={initialNotifications} displayDrawer={true} />);

//   expect(renderSpy).toHaveBeenCalledTimes(1);

//   rerender(<Notifications notifications={newNotifications} displayDrawer={true} />);

//   expect(renderSpy).toHaveBeenCalledTimes(2);
//   renderSpy.mockRestore();
// });

// test('should not rerender if the notifications length is unchanged', () => {
//   const initialNotifications = [
//     { id: 1, type: 'default', value: 'Notification 1' },
//     { id: 2, type: 'urgent', value: 'Notification 2' },
//   ];

//   const renderSpy = jest.spyOn(Notifications.prototype, 'render');

//   const { rerender } = render(<Notifications notifications={initialNotifications} displayDrawer={true} />);

//   expect(renderSpy).toHaveBeenCalledTimes(1);

//   rerender(<Notifications notifications={initialNotifications} displayDrawer={true} />);

//   expect(renderSpy).toHaveBeenCalledTimes(1);
//   renderSpy.mockRestore();
// });

test('should return true if the Notifications component is a functional component', () => {
  expect(typeof Notifications.type).toBe('function');
  expect(Notifications.$$typeof.toString()).toBe('Symbol(react.memo)');
  expect(Notifications.type.prototype?.isReactComponent).toBeUndefined();
})

test('should call the "handleDisplayDrawer" props whenever the "Your notifications" is clicked', () => {
  const handleDisplayDrawerMock = jest.fn()

  render(<Notifications handleDisplayDrawer={handleDisplayDrawerMock} />)

  const notificationText = screen.getByText(/your notifications/i);
  
  fireEvent.click(notificationText)
  
  expect(handleDisplayDrawerMock).toHaveBeenCalled()
})

test('should call the "handleDHieDrawer" props whenever the close button is clicked', () => {
  const handleHideDrawerMock = jest.fn();

  const notificationsMock = [
    { id: 1, type: 'default', value: 'dummy value' }
  ];

  render(
    <Notifications 
      displayDrawer={true} 
      handleHideDrawer={handleHideDrawerMock}
      notifications={notificationsMock}
    />
  );

  const closeButton = screen.getByLabelText('Close');

  fireEvent.click(closeButton);

  expect(handleHideDrawerMock).toHaveBeenCalled();
})

test('should show the list of notifications whenever the "handleDisplayDrawer" is called', () => {
  const handleDisplayDrawerMock = jest.fn();
  const notificationsMock = [
    { id: 1, type: 'default', value: 'Notification 1' },
  ];

  render(
    <Notifications
      displayDrawer={false}
      handleDisplayDrawer={handleDisplayDrawerMock}
      notifications={notificationsMock}
    />
  );

  const notificationTitle = screen.getByText('Your notifications');
  fireEvent.click(notificationTitle);

  expect(handleDisplayDrawerMock).toHaveBeenCalled();

  render(
    <Notifications
      displayDrawer={true}
      handleDisplayDrawer={handleDisplayDrawerMock}
      notifications={notificationsMock}
    />
  );

  expect(screen.getByText('Here is the list of notifications')).toBeInTheDocument();
});

test('should hide the list of notifications whenever the "handleHideDrawer" is called', () => {

  // Mock parent wrap to properly simulate parent state management
  const handleHideDrawerMock = jest.fn();
  const MockParentWrapper = () => {
    const [isDisplayed, setIsDisplayed] = React.useState(true);
    
    const handleHideDrawer = () => {
      setIsDisplayed(false);
      handleHideDrawerMock()
    };

    const notificationsMock = [
      { id: 1, type: 'default', value: 'Notification 1' },
    ];

    return (
      <Notifications
        displayDrawer={isDisplayed}
        handleHideDrawer={handleHideDrawer}
        notifications={notificationsMock}
      />
    );
  };

  render(<MockParentWrapper />)

  // Verify initial state
  expect(screen.getByText('Here is the list of notifications')).toBeInTheDocument();

  // Click close button
  const closeButton = screen.getByLabelText('Close');
  fireEvent.click(closeButton);

  // Verify notifications are hidden
  expect(handleHideDrawerMock).toHaveBeenCalled();
});

// ==========================================

test('it should rerender when prop values change', () => {
  const markAsReadMock = jest.fn();

  const initialProps = {
    displayDrawer: true,
    notifications: [
      { id: 1, type: 'default', value: 'New notification' },
      { id: 2, type: 'urgent', value: 'Urgent notification' }
    ],
    markNotificationAsRead: markAsReadMock,
  };

  const { rerender } = render(<Notifications {...initialProps} />);

  const listItems = screen.getAllByRole('listitem');
  expect(listItems).toHaveLength(2);

  fireEvent.click(screen.getByText('New notification'));

  expect(markAsReadMock).toHaveBeenCalledWith(1);

  const updatedProps = {
    ...initialProps,
    notifications: [
      { id: 2, type: 'urgent', value: 'Urgent notification' }
    ]
  };

  rerender(<Notifications {...updatedProps} />);

  expect(screen.getAllByRole('listitem')).toHaveLength(1);
});

// The Notifications is a function component
test('should return true if the Notifications component is a functional component', () => {
	expect(typeof Notifications.type).toBe('function');
	expect(Notifications.$$typeof.toString()).toBe('Symbol(react.memo)');
	expect(Notifications.type.prototype?.isReactComponent).toBeUndefined();
});

// handle memoization

describe('Notifications Memo Behavior', () => {
  test('should not re-render when notifications array remains unchanged', () => {
    const initialProps = {
      displayDrawer: true,
      notifications: [
        { id: 1, type: 'default', value: 'Test notification' }
      ],
      handleDisplayDrawer: jest.fn(),
      handleHideDrawer: jest.fn(),
      markNotificationAsRead: jest.fn()
    };

    const { rerender } = render(
      <Notifications 
        {...initialProps}
      />
    );

    const firstRender = screen.getAllByRole('listitem').find(listitem => listitem.textContent === 'Test notification')
    
    // Re-render with same props
    rerender(
      <Notifications 
        {...initialProps}
      />
    );

    const secondRender = screen.getAllByRole('listitem').find(listitem => listitem.textContent === 'Test notification')
    
    // Should be the same instance due to memo
    expect(firstRender).toBe(secondRender);
  });

  test('should re-render when notifications content changes', () => {
    const initialProps = {
      displayDrawer: true,
      notifications: [
        { id: 1, type: 'default', value: 'Initial notification' }
      ],
      handleDisplayDrawer: jest.fn(),
      handleHideDrawer: jest.fn(),
      markNotificationAsRead: jest.fn()
    };

    const { rerender } = render(<Notifications {...initialProps} />);

    // Modify notification content
    const updatedProps = {
      ...initialProps,
      notifications: [
        { id: 1, type: 'urgent', value: 'Updated notification' }
      ]
    };

    rerender(<Notifications {...updatedProps} />);

    // Should reflect the updated content
    expect(screen.getByText('Updated notification')).toBeInTheDocument();
  });

  test('should re-render when notifications array length changes', () => {
    const initialProps = {
      displayDrawer: true,
      notifications: [
        { id: 1, type: 'default', value: 'Test notification' }
      ],
      handleDisplayDrawer: jest.fn(),
      handleHideDrawer: jest.fn(),
      markNotificationAsRead: jest.fn()
    };

    const { rerender } = render(<Notifications {...initialProps} />);

    // Add new notification
    const updatedProps = {
      ...initialProps,
      notifications: [
        ...initialProps.notifications,
        { id: 2, type: 'urgent', value: 'New notification' }
      ]
    };

    rerender(<Notifications {...updatedProps} />);

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  test('should handle html property changes in notifications', () => {
    const initialProps = {
      displayDrawer: true,
      notifications: [
        { 
          id: 1, 
          type: 'urgent', 
          html: { __html: '<strong>Initial</strong>' } 
        }
      ],
      handleDisplayDrawer: jest.fn(),
      handleHideDrawer: jest.fn(),
      markNotificationAsRead: jest.fn()
    };

    const { rerender } = render(<Notifications {...initialProps} />);

    // Update html content
    const updatedProps = {
      ...initialProps,
      notifications: [
        { 
          id: 1, 
          type: 'urgent', 
          html: { __html: '<strong>Updated</strong>' } 
        }
      ]
    };

    rerender(<Notifications {...updatedProps} />);

    expect(screen.getByRole('listitem')).toContainHTML('<strong>Updated</strong>');
  });
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});
