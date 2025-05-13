import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faUpload } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ onLogout, onUpload }) => {
  const navigate = useNavigate();  // Hook to navigate to different routes

  return (
    <aside className="w-64 bg-white p-6 rounded-tr-3xl rounded-br-3xl shadow-md">
      <div className="flex items-center gap-2 mb-10">
        <FontAwesomeIcon icon={faCamera} className="text-3xl" />
        <h1 className="text-2xl font-bold text-gray-800">ShutterUp</h1>
      </div>

      {/* Navigation menu */}
      <nav className="flex flex-col gap-4 text-gray-700 font-medium">
         
         {/* Button to navigate to Home page */}
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-600 rounded-lg"
        >
          📊 Home
        </button>

        {/* Button to navigate to Gallery page */}
        <button 
          onClick={() => navigate('/gallery')}
          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg"
        >
          🖼️ Create Your Gallery
        </button>

        {/* Button trigger to file upload (calls onUpload function passed as prop) */}
        <button 
          onClick={onUpload}
          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg"
        >
          <FontAwesomeIcon icon={faUpload} /> Upload
        </button>
        
        {/* Button for Favorites page */}
        <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg">
          ❤️ Favorites
        </button>

        {/* Button for Notifications */}
        <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg">
          🔔 Notifications
        </button>

        {/* Button for profile */}
        <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg">
          👤 Profile
        </button>

        {/* Button to call logout function */}
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 px-3 py-2 hover:bg-red-100 text-red-600 rounded-lg mt-4"
        >
          🚪 Logout
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;