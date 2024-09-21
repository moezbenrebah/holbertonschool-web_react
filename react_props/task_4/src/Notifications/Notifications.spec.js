import { render, screen, fireEvent } from '@testing-library/react';
import { getLatestNotification } from '../utils/utils'
import Notifications from './Notifications';

test('it should display a title, button and a 3 list items, whenever the "displayDrawer" set to true', () => {
  const props = {
    listNotifications: [
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
    listNotifications: [
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
    listNotifications: [
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


test('it should log "Close button has been clicked" whenever the close button is clicked and, the "displayDrawer" set to true', () => {
  const props = {
    listNotifications: [
      { id:1, type:'default', value:'New course available' },
      { id:2, type:'urgent', value:'New resume available' },
      { id:3, type:'urgent', html:{ __html: getLatestNotification()} }
    ], 
    displayDrawer: true
  }
  render(<Notifications {...props} />)

  const notificationsButton = screen.getByRole('button');

  const consoleSpy = jest.spyOn(console, 'log');

  fireEvent.click(notificationsButton);

  expect(consoleSpy).toHaveBeenCalledWith('Close button has been clicked');

  consoleSpy.mockRestore();
})

test('it should render the 3 given notifications text, whenever the "displayDrawer" set to true', () => {
  const props = {
    listNotifications: [
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
    listNotifications: [
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
    listNotifications: [], 
    displayDrawer: true
  }
  render(<Notifications {...props} />)

  const notificationsTitle = screen.getByText('No new notification for now');
  
  expect(notificationsTitle).toBeInTheDocument();
});

// === The items ===: [
//   <ref *1> HTMLLIElement {
//     '__reactFiber$lu2vj9wnsi9': FiberNode {
//       tag: 5,
//       key: null,
//       elementType: 'li',
//       type: 'li',
//       stateNode: [Circular *1],
//       return: [FiberNode],
//       child: null,
//       sibling: null,
//       index: 0,
//       ref: null,
//       pendingProps: [Object],
//       memoizedProps: [Object],
//       updateQueue: null,
//       memoizedState: null,
//       dependencies: null,
//       mode: 1,
//       flags: 0,
//       subtreeFlags: 0,
//       deletions: null,
//       lanes: 0,
//       childLanes: 0,
//       alternate: null,
//       actualDuration: 0,
//       actualStartTime: -1,
//       selfBaseDuration: 0,
//       treeBaseDuration: 0,
//       _debugSource: undefined,
//       _debugOwner: [FiberNode],
//       _debugNeedsRemount: false,
//       _debugHookTypes: null
//     },
//     '__reactProps$lu2vj9wnsi9': {
//       style: [Object],
//       'data-notification-type': 'default',
//       children: 'New course available'
//     },
//     [Symbol(SameObject caches)]: [Object: null prototype] {
//       style: [CSSStyleDeclaration],
//       childNodes: NodeList {}
//     }
//   },
//   <ref *2> HTMLLIElement {
//     '__reactFiber$lu2vj9wnsi9': FiberNode {
//       tag: 5,
//       key: null,
//       elementType: 'li',
//       type: 'li',
//       stateNode: [Circular *2],
//       return: [FiberNode],
//       child: null,
//       sibling: null,
//       index: 0,
//       ref: null,
//       pendingProps: [Object],
//       memoizedProps: [Object],
//       updateQueue: null,
//       memoizedState: null,
//       dependencies: null,
//       mode: 1,
//       flags: 0,
//       subtreeFlags: 0,
//       deletions: null,
//       lanes: 0,
//       childLanes: 0,
//       alternate: null,
//       actualDuration: 0,
//       actualStartTime: -1,
//       selfBaseDuration: 0,
//       treeBaseDuration: 0,
//       _debugSource: undefined,
//       _debugOwner: [FiberNode],
//       _debugNeedsRemount: false,
//       _debugHookTypes: null
//     },
//     '__reactProps$lu2vj9wnsi9': {
//       style: [Object],
//       'data-notification-type': 'urgent',
//       children: 'New resume available'
//     },
//     [Symbol(SameObject caches)]: [Object: null prototype] {
//       style: [CSSStyleDeclaration],
//       childNodes: NodeList {}
//     }
//   },
//   <ref *3> HTMLLIElement {
//     '__reactFiber$lu2vj9wnsi9': FiberNode {
//       tag: 5,
//       key: null,
//       elementType: 'li',
//       type: 'li',
//       stateNode: [Circular *3],
//       return: [FiberNode],
//       child: null,
//       sibling: null,
//       index: 0,
//       ref: null,
//       pendingProps: [Object],
//       memoizedProps: [Object],
//       updateQueue: null,
//       memoizedState: null,
//       dependencies: null,
//       mode: 1,
//       flags: 0,
//       subtreeFlags: 0,
//       deletions: null,
//       lanes: 0,
//       childLanes: 0,
//       alternate: null,
//       actualDuration: 0,
//       actualStartTime: -1,
//       selfBaseDuration: 0,
//       treeBaseDuration: 0,
//       _debugSource: undefined,
//       _debugOwner: [FiberNode],
//       _debugNeedsRemount: false,
//       _debugHookTypes: null
//     },
//     '__reactProps$lu2vj9wnsi9': {
//       style: [Object],
//       'data-notification-type': 'urgent',
//       dangerouslySetInnerHTML: [Object]
//     },
//     [Symbol(SameObject caches)]: [Object: null prototype] {
//       style: [CSSStyleDeclaration],
//       childNodes: NodeList {}
//     }
//   }
// ]
