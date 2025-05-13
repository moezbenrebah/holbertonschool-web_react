import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Assure-toi que App.js est au bon endroit
import './index.css'; // Optionnel, si tu as des styles globaux

// Sélectionne la div avec l'ID root dans index.html
const root = ReactDOM.createRoot(document.getElementById('root'));

// Monte le composant App dans le DOM
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
