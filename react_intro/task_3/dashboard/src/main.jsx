import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Notifications from './Notifications.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div className="root-notifications">
      <Notifications />
    </div>
    <App />
  </React.StrictMode>,
)
