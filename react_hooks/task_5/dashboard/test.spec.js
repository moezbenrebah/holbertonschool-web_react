import { renderHook, act } from '@testing-library/react';
import useLogin from './src/hooks/useLogin';
import { StyleSheetTestUtils } from 'aphrodite';

beforeAll(() => {
  StyleSheetTestUtils.suppressStyleInjection();
});

afterAll(() => {
  StyleSheetTestUtils.clearBufferAndResumeStyleInjection();
});

describe('test useLogin', () => {
  const mockOnLogin = jest.fn();
  const mockEvent = {
    preventDefault: jest.fn(),
    target: {
      value: ''
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

	test('should initialize with default values', () => {
    const { result } = renderHook(() => useLogin({ onLogin: mockOnLogin }));

    expect(result.current).toEqual({
      email: '',
      password: '',
      enableSubmit: false,
      handleChangeEmail: expect.any(Function),
      handleChangePassword: expect.any(Function),
      handleLoginSubmit: expect.any(Function)
    });
  });

	test('should handle email change and validate form', () => {
    const { result } = renderHook(() => useLogin({ onLogin: mockOnLogin }));

    act(() => {
      mockEvent.target.value = 'test@example.com';
      result.current.handleChangeEmail(mockEvent);
    });

    expect(result.current.email).toBe('test@example.com');
    expect(result.current.enableSubmit).toBe(false);
  });

	test('should handle password change and validate form', () => {
    const { result } = renderHook(() => useLogin({ onLogin: mockOnLogin }));

    act(() => {
      mockEvent.target.value = 'password123';
      result.current.handleChangePassword(mockEvent);
    });

    expect(result.current.password).toBe('password123');
    expect(result.current.enableSubmit).toBe(false);
  });
});