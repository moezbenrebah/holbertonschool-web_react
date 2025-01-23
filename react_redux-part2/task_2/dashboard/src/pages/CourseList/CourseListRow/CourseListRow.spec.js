import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import CourseListRow from "./CourseListRow";


describe('CourseListRow', () => {
  test('renders a header row with one cell', () => {
    render(
      <CourseListRow isHeader={true} textFirstCell="Available courses" />
    );
    const headerCell = screen.getByRole('columnheader', { name: 'Available courses' });
    expect(headerCell).toHaveAttribute('colSpan', '2');
  });

  test('renders a header row with two cells', () => {
    render(
      <CourseListRow
        isHeader={true}
        textFirstCell="Course name"
        textSecondCell="Credit"
      />
    );
    const headerCell1 = screen.getByRole('columnheader', { name: 'Course name' });
    const headerCell2 = screen.getByRole('columnheader', { name: 'Credit' });
    expect(headerCell1).toBeInTheDocument();
    expect(headerCell2).toBeInTheDocument();
  });

  test('renders a regular row', () => {
    render(
      <CourseListRow
        isHeader={false}
        textFirstCell="ES6"
        textSecondCell="60"
      />
    );
    const cell1 = screen.getByRole('cell', { name: 'ES6' });
    const cell2 = screen.getByRole('cell', { name: '60' });
    expect(cell1).toBeInTheDocument();
    expect(cell2).toBeInTheDocument();
  });

  test('calls onChangeRow when the checkbox is clicked', async() => {
    const onChangeRow = jest.fn();
    render(
      <CourseListRow
        isHeader={false}
        textFirstCell="ES6"
        textSecondCell="60"
        id={1}
        isSelected={false}
        onChangeRow={onChangeRow}
      />
    );

    const checkbox = screen.getByRole('checkbox');

    act(() => fireEvent.click(checkbox, { target: { checked: true } }))

    await waitFor(() => expect(onChangeRow).toHaveBeenCalledWith(1, true))

    fireEvent.click(checkbox, { target: { checked: false } });
    expect(onChangeRow).toHaveBeenCalledWith(1, false);
  });

  test('renders a checked checkbox when isSelected is true', () => {
    render(
      <CourseListRow
        isHeader={false}
        textFirstCell="ES6"
        textSecondCell="60"
        id={1}
        isSelected={true}
        onChangeRow={() => {}}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });
});
