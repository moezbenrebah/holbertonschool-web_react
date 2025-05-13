import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";

const Upload = () => {
  const [file, setFile] = useState(null);  // store selected file
  const [uploading, setUploading] = useState(false); // track if upload is in progress
  const navigate = useNavigate();

  const handleFileChange = (e) => { //handle file input change
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => { // Handle form submission for file upload
    e.preventDefault();

    if (!file) return; // If no file is selected, do nothing
  
    const token = localStorage.getItem("token");
    const formData = new FormData(); // Create form data to send file
    formData.append("image", file);
  
    setUploading(true);
    try {
      // Send POST request to upload image
      const response = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, //send token
        },
        body: formData, // Attach form data
      });

      // throw error if upload fails
      if (!response.ok) throw new Error("Failed to upload");
      navigate("/dashboard"); // navigate to dashboard
    } catch (error) {
      alert(error.message); // show error 
    } finally {
      setUploading(false); //stop loading indicator
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-200 to-blue-100">
      
      {/* Back button to go to dashboard */}
      <button
        type="button"
        onClick={() => navigate("/dashboard")}
        className="absolute top-6 left-6 text-blue-600 hover:underline"
      >
        ← Back to Dashboard
      </button>

      {/* Upload form */}
      <form
        onSubmit={handleUpload}
        className="w-full max-w-xl p-10 bg-white rounded-xl shadow-md"
      >
        {/* File upload area */}
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-gray-100 transition"
        >
          <FontAwesomeIcon icon={faCloudUploadAlt} className="text-gray-600 text-5xl mb-2" />
          <p className="text-gray-700 font-medium">
            Drag & drop photos here, or click to select
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Maximum file size: 10MB per photo
          </p>
          <p className="text-sm text-gray-500">Upload up to 10 photos at once</p>
          
          {/* Hidden file input */}
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

          {/* Submit button */}
        <div className="mt-6 text-center">
          <button
            type="submit"
            disabled={uploading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Upload;