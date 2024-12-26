import { useState } from 'react';

export default function useLogin(
  { 
    onLogin
  }
) {

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    enableSubmit: false
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      return {
        ...newData,
        enableSubmit: validateEmail(newData.email) && newData.password.length >= 8
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(formData.email, formData.password);
  };

  return {
    email: formData.email,
    password: formData.password,
    enableSubmit: formData.enableSubmit,
    handleChange,
    handleSubmit
  };
}

// export default function useLogin({ initialEmail = '', initialPassword = '', onLogin }) {
//   const [formData, setFormData] = useState({
//     email: initialEmail,
//     password: initialPassword
//   });

//   const [enableSubmit, setEnableSubmit] = useState(false);

//   const validateEmail = (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   const validateForm = (email, password) => {
//     return validateEmail(email) && password.length >= 8;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => {
//       const newData = { ...prev, [name]: value };
//       setEnableSubmit(validateForm(
//         name === 'email' ? value : newData.email,
//         name === 'password' ? value : newData.password
//       ));
//       return newData;
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (enableSubmit && onLogin) {
//       onLogin(formData.email, formData.password);
//     }
//   };

//   return {
//     email: formData.email,
//     password: formData.password,
//     enableSubmit,
//     handleChange,
//     handleSubmit,
//   };
// }
