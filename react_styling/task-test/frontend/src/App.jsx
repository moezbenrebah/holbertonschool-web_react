// Import necessary components and libraries
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './dashboard/Dashboard';
import ProtectedRoute from './util/ProtectedRoute';
import { AuthProvider } from './util/AuthContext';
import Upload from './dashboard/Upload';
import Gallery from "./gallery/Gallery"; 
import GalleryDetail from "./gallery/GalleryDetail";


// Main application component
function App() {
  return (
    // Wrap the application in AuthProvider to manage authentication context
    <AuthProvider>

      {/* Router for handling different routes */}
      <Router>

        {/* Define the routes for the app */}
        <Routes> 
          <Route path="/" element={<><Navbar /><Home /></>} />
          <Route path="/signup" element={<><Navbar /><Signup /></>} />
          <Route path="/login" element={<><Navbar /><Login /></>} />
          <Route element={<ProtectedRoute />}>
            
            {/* Protected routes requiring authentication */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/gallery/:url" element={<GalleryDetail />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;