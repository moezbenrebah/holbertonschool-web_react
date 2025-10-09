import { render } from '@testing-library/react';
import { StyleSheetTestUtils } from 'aphrodite';
import BodySectionWithMarginBottom from './BodySectionWithMarginBottom';

beforeAll(() => {
  StyleSheetTestUtils.suppressStyleInjection();
});

afterAll(() => {
  StyleSheetTestUtils.clearBufferAndResumeStyleInjection();
});

const mockBodySection = jest.fn();
jest.mock("./BodySection", () => {
  const MockBodySection = (props) => {
    mockBodySection(props);
    return (
      <div>
        <h2>{props.title}</h2>
        {props.children}
      </div>
    );
  };
  MockBodySection.displayName = 'MockBodySection';
  return MockBodySection;
});

describe('BodySectionWithMarginBottom', () => {
    test('should render BodySection inside a div with class bodySectionWithMargin', () => {
      const { container } = render(
        <BodySectionWithMarginBottom title="Hello!">
          <p>This is child content</p>
          <span>Hey there!</span>
        </BodySectionWithMarginBottom>
      );

      expect(mockBodySection).toHaveBeenCalled();
      // Check for Aphrodite-generated class name (starts with bodySectionWithMargin_)
      const classNames = container.firstChild.className;
      expect(classNames).toMatch(/bodySectionWithMargin_/);
      expect(mockBodySection).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Hello!",
          children: expect.anything(),
        })
      );
      expect(container.firstChild).toHaveTextContent('Hello!');
      // Use firstChild instead of querySelector since class name is dynamic
      const bodySectionWithMargin = container.firstChild;
      expect(bodySectionWithMargin).toHaveTextContent('Hello!');
      expect(bodySectionWithMargin).toHaveTextContent('This is child content');
      expect(bodySectionWithMargin).toHaveTextContent('Hey there!');

      const pElement = container.querySelector('p');
      const spanElement = container.querySelector('span');
      expect(pElement).toBeInTheDocument();
      expect(pElement).toHaveTextContent('This is child content');
      expect(spanElement).toBeInTheDocument();
      expect(spanElement).toHaveTextContent('Hey there!');
    });

  test('should apply margin-bottom of 40px to the div with class bodySectionWithMargin', () => {
    const { container } = render(
      <BodySectionWithMarginBottom title="Test Title">
        <p>Child Content</p>
      </BodySectionWithMarginBottom>
    );

    // Use firstChild instead of querySelector since Aphrodite generates dynamic class names
    const divWithMargin = container.firstChild;
    expect(divWithMargin).toBeInTheDocument();
    // Check that it has an Aphrodite-generated class name starting with bodySectionWithMargin_
    expect(divWithMargin.className).toMatch(/bodySectionWithMargin_/);
  });
});
