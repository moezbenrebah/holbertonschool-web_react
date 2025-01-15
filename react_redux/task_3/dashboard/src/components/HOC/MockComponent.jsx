import React from 'react';
import { useSelector } from 'react-redux';

const MockComponent = () => {
  const mockState = useSelector((state) => state.mock);

  // Safely access mockState.value using optional chaining
  return <div data-testid="mock-state">{mockState?.value || 'No value'}</div>;
};

export default MockComponent;