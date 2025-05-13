import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'; // global CSS file for style
import App from './App.jsx'

// Show the app inside 'root' and use StrictMode for development
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App /> 
  </StrictMode>,
);
