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

test('should rerender when the notifications length changes', () => {
  const initialNotifications = [
    { id: 1, type: 'default', value: 'Notification 1' },
  ];

  const newNotifications = [
    { id: 1, type: 'default', value: 'Notification 1' },
    { id: 2, type: 'urgent', value: 'Notification 2' },
  ];

  const renderSpy = jest.spyOn(Notifications.prototype, 'render');

  const { rerender } = render(<Notifications notifications={initialNotifications} displayDrawer={true} />);

  expect(renderSpy).toHaveBeenCalledTimes(1);

  rerender(<Notifications notifications={newNotifications} displayDrawer={true} />);

  expect(renderSpy).toHaveBeenCalledTimes(2);
  renderSpy.mockRestore();
});

test('should not rerender if the notifications length is unchanged', () => {
  const initialNotifications = [
    { id: 1, type: 'default', value: 'Notification 1' },
    { id: 2, type: 'urgent', value: 'Notification 2' },
  ];

  const renderSpy = jest.spyOn(Notifications.prototype, 'render');

  const { rerender } = render(<Notifications notifications={initialNotifications} displayDrawer={true} />);

  expect(renderSpy).toHaveBeenCalledTimes(1);

  rerender(<Notifications notifications={initialNotifications} displayDrawer={true} />);

  expect(renderSpy).toHaveBeenCalledTimes(1);
  renderSpy.mockRestore();
});

test('should return true if the Notifications component is a class pure component', () => {
  const props = Object.getOwnPropertyNames(Notifications.prototype);
  const isClassPureComponent = Notifications.prototype.__proto__ === React.PureComponent.prototype;
  const inheritsFromReactComponent = Object.getPrototypeOf(Notifications.prototype) === React.PureComponent.prototype;
  
  expect(props).toContain('constructor');
  expect(isClassPureComponent).toBe(true);
  expect(inheritsFromReactComponent).toBe(true);
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
  const handleHideDrawerMock = jest.fn();
  const notificationsMock = [
    { id: 1, type: 'default', value: 'Notification 1' },
  ];

  const { rerender } = render(
    <Notifications
      displayDrawer={true}
      handleHideDrawer={handleHideDrawerMock}
      notifications={notificationsMock}
    />
  );

  expect(screen.getByText('Here is the list of notifications')).toBeInTheDocument();

  const closeButton = screen.getByLabelText('Close');
  fireEvent.click(closeButton);

  expect(handleHideDrawerMock).toHaveBeenCalled();

  rerender(
    <Notifications
      displayDrawer={false}
      handleHideDrawer={handleHideDrawerMock}
      notifications={notificationsMock}
    />
  );

  expect(screen.queryByText('Here is the list of notifications')).not.toBeInTheDocument();
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