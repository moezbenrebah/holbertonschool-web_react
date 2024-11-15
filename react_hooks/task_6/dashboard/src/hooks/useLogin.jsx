import { useState, useCallback } from 'react';

export default function useLogin({ initialEmail = '', initialPassword = '', onLogin }) {
  const [formData, setFormData] = useState({
    email: initialEmail,
    password: initialPassword
  });

  const [enableSubmit, setEnableSubmit] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = useCallback((email, password) => {
    return validateEmail(email) && password.length >= 8;
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      setEnableSubmit(validateForm(
        name === 'email' ? value : newData.email,
        name === 'password' ? value : newData.password
      ));
      return newData;
    });
  }, [validateForm]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (enableSubmit && onLogin) {
      onLogin(formData.email, formData.password);
    }
  }, [enableSubmit, formData, onLogin]);

  const reset = useCallback(() => {
    setFormData({
      email: initialEmail,
      password: initialPassword
    });
    setEnableSubmit(false);
  }, [initialEmail, initialPassword]);

  return {
    email: formData.email,
    password: formData.password,
    enableSubmit,
    handleChange,
    handleSubmit,
    reset
  };
}