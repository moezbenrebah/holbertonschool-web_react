import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchGalleryByUrl } from '../util/photoAPI';
import PhotoGrid from "../dashboard/components/PhotoGrid";
import PhotoModal from "../dashboard/components/PhotoModal";

const GalleryDetail = () => {
  const { url } = useParams(); // Extract 'url' from the URL parameters 
  const navigate = useNavigate(); 
  const [gallery, setGallery] = useState(null);  // store gallery data
  const [loading, setLoading] = useState(true); // manage loading status
  const [error, setError] = useState(null); //  manage error msgs
  const [selectedPhoto, setSelectedPhoto] = useState(null); // selected photo for modal


  // Fetch gallery info when the component first loads or the URL changes
  useEffect(() => {
    const loadGallery = async () => {
      try {
        const data = await fetchGalleryByUrl(url); // Fetch gallery by URL
        setGallery(data);
      } catch (err) {
        setError(err.message); // Set error message if fetch fails
      } finally {
        setLoading(false); // Stop loading once the data is fetched
      }
    };

    loadGallery();
  }, [url]); // Run again this effect if 'url' changes

  // Show loading, error, or not found message
  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
  if (!gallery) return <div className="p-8">Gallery not found</div>;

  return (
    <div className="p-8 min-h-screen">

       {/* Back button to navigate to previous page */}
      <button 
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back
      </button>
      
      {/* Display gallery title and description */}
      <h1 className="text-3xl font-bold mb-2">{gallery.title}</h1>
      <p className="text-gray-700 mb-6">{gallery.description}</p>
      
      {/* Display photo grid component with gallery photos */}
      <div className="mt-8">
        <PhotoGrid
          photos={gallery.photos || []} // Pass gallery photos (empty array if none)
          onPhotoClick={setSelectedPhoto} // Set selected photo for modal view
          refreshPhotos={() => fetchGalleryByUrl(url).then(setGallery)} // Refresh gallery photos
        />
      </div>

      {/* Photo modal for enlarged view */}
      {selectedPhoto && (
        <PhotoModal 
          photo={selectedPhoto} 
          onClose={() => setSelectedPhoto(null)} // Close modal when user clicks close
        />
      )}
    </div>
  );
};

export default GalleryDetail;