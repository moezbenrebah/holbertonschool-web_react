import React from "react";
import { render, screen } from '@testing-library/react';
import CourseList from './CourseList';

test('it should render the CourseList component without crashing', () => {
  render(<CourseList listCourses={
   [ { id:1, name:'ES6', credit:60 },
    { id:2, name:'Webpack', credit:20 },
    { id:3, name:'React', credit:40 }]
  }/>)

  const rowElements = screen.getAllByRole('row');

  expect(rowElements).toHaveLength(5)
})
