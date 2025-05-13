import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


// ===== Gallery COMPONENT =====
// * provide create gallery with tile, decription, & URL
const Gallery = () => {
  const [title, setTitle] = useState(""); //state title input
  const [description, setDescription] = useState(""); // state decription
  const [url, setUrl] = useState(""); // URL
  const [message, setMessage] = useState(""); // display messages
  const navigate = useNavigate(); // navigating to different routes


  // ===== FORM SUBMISSION HANDLER =====
  const handleSubmit = async (e) => {
    e.preventDefault(); //default form submission behavior
  
    // Gather gallery data to send in API request
    const galleryData = {
      title,
      description,
      url,
    };
  
    try {
      const token = localStorage.getItem('token'); // get token from storage
      const response = await fetch("http://localhost:5000/api/gallery/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // add token header
        },
        body: JSON.stringify(galleryData), // Send gallery data as JSON
      });
  
      const data = await response.json(); // Parse the response

       // Handle response based on success or failure
      if (!response.ok) {
        setMessage(data.message || "Gallery creation failed.");
      } else {
        setMessage("");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gradient-to-br from-green-200 to-blue-100">
      
      {/* Back to Dashboard button */}
      <button
        type="button"
        onClick={() => navigate("/dashboard")}
        className="absolute top-6 left-6 text-blue-600 hover:underline"
      >
        ← Back to Dashboard
      </button>

      {/* Gallery creation form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-md shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Create Event Gallery
        </h2>

         {/* Message for errors or success */}
        {message && (
          <div className="mb-4 text-sm text-center text-red-600">{message}</div>
        )}

        {/* Title input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summer Wedding 2024"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
            required
          />
        </div>
        
        {/* Description input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Share details about your event..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
            rows="4"
            required
          />
        </div>

          {/* URL input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gallery URL
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="summer-wedding-2024"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
            required
          />
        </div>

          {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-md font-semibold hover:bg-yellow-900 transition"
        >
          Create Gallery
        </button>
      </form>
    </div>
  );
};

export default Gallery;