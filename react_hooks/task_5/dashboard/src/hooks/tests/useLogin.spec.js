import { renderHook, act } from '@testing-library/react';
import useLogin from '../useLogin';

describe('useLogin', () => {
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

	test('should enable submit when both fields are valid', () => {
    const { result } = renderHook(() => useLogin({ onLogin: mockOnLogin }));
    
    act(() => {
      result.current.handleChangeEmail({ target: { value: 'test@example.com' } });
    });
    
    act(() => {
      result.current.handleChangePassword({ target: { value: 'password123' } });
    });

    expect(result.current.enableSubmit).toBe(true);
  });

	test('should handle form submission with valid data', () => {
    const { result } = renderHook(() => useLogin({ onLogin: mockOnLogin }));
    
    act(() => {
      result.current.handleChangeEmail({ target: { value: 'test@example.com' } });
    });

    act(() => {
      result.current.handleChangePassword({ target: { value: 'password123' } });
    });
    
    const mockEvent = { preventDefault: jest.fn() };
    act(() => {
      result.current.handleLoginSubmit(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockOnLogin).toHaveBeenCalledWith('test@example.com', 'password123');
  });

	test('should not enable submit with invalid email', () => {
    const { result } = renderHook(() => useLogin({ onLogin: mockOnLogin }));

    act(() => {
      mockEvent.target.value = 'invalid-email';
      result.current.handleChangeEmail(mockEvent);
      
      mockEvent.target.value = 'password123';
      result.current.handleChangePassword(mockEvent);
    });

    expect(result.current.enableSubmit).toBe(false);
  });

	test('should not enable submit with short password', () => {
    const { result } = renderHook(() => useLogin({ onLogin: mockOnLogin }));

    act(() => {
      mockEvent.target.value = 'test@example.com';
      result.current.handleChangeEmail(mockEvent);
      
      mockEvent.target.value = 'short';
      result.current.handleChangePassword(mockEvent);
    });

    expect(result.current.enableSubmit).toBe(false);
  });
})
