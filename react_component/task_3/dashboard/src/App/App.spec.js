import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  jest.spyOn(document, 'addEventListener');
  jest.spyOn(document, 'removeEventListener');
});

afterEach(() => {
  document.addEventListener.mockRestore();
  document.removeEventListener.mockRestore();
});

test('should return true if the App component is a class component', () => {
  const props = Object.getOwnPropertyNames(App.prototype);
  const isClassComponent = App.prototype.__proto__ === React.Component.prototype;
  const inheritsFromReactComponent = Object.getPrototypeOf(App.prototype) === React.Component.prototype;
  
  expect(props).toContain('constructor');
  expect(isClassComponent).toBe(true);
  expect(inheritsFromReactComponent).toBe(true);
});

test('it should call the logOut prop once whenever the user hits "Ctrl" + "h" keyboard keys', () => {
  const logOutMock = jest.fn();

  jest.spyOn(window, 'alert').mockImplementation(() => {});
  render(<App isLoggedIn={true} logOut={logOutMock} />);

  fireEvent.keyDown(document, { ctrlKey: true, key: 'h' });

  expect(logOutMock).toHaveBeenCalledTimes(1);
});

test('it should display an alert window whenever the user hit "ctrl" + "h" keyboard keys', () => {
  const logoutSpy = jest.fn();
  window.alert = jest.fn();
  
  render(<App logOut={logoutSpy} />);
  
  fireEvent.keyDown(document, { ctrlKey: true, key: 'h' });
  
  expect(window.alert).toHaveBeenCalledWith('Logging you out');
});

test('should remove event listener in componentWillUnmount', () => {
  const { unmount } = render(<App isLoggedIn={false} />);

  expect(document.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));

  unmount();

  expect(document.removeEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
});

test('should add event listener in componentDidMount', () => {
  render(<App isLoggedIn={false} />);

  expect(document.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
});

test('it should add the title of "course list" above the CourseList component when the isLoggedIn prop set to true', () => {
  render(<App isLoggedIn={true} />)

  expect(screen.getByRole('heading', { name: /course list/i })).toBeInTheDocument();
});

test('it should add the title of "Log in to continue" above the Login component when the isLoggedIn prop set to false', () => {
  render(<App isLoggedIn={false} />)

  expect(screen.getByRole('heading', { name: /log in to continue/i })).toBeInTheDocument();
});

test('it should render a heading element with a text "", and a paragraph with text ""', () => {
  render(<App />)

  expect(screen.getByRole('heading', { name: /news from the school/i})).toBeInTheDocument();
  expect(screen.getByText(/Holberton School news goes here/i)).toBeInTheDocument()
});
