import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faBookmark } from '@fortawesome/free-solid-svg-icons';
import { deletePhoto, API_BASE } from '../../util/photoAPI';
import { useAuth } from '../../util/AuthContext';


// ===== ImageCard COMPONENT =====
// Provides photo deletion and gallery assignment functionalities
const ImageCard = ({ photoId, onSuccess, galleries }) => {


  const [isDeleting, setIsDeleting] = useState(false); // track delete operation
  const [isAddingToGallery, setIsAddingToGallery] = useState(false); // track gallery addition
  const [selectedGallery, setSelectedGallery] = useState(''); // selected gallery
  const [error, setError] = useState(null); // error msg
  const { token } = useAuth(); // Get auth token


  // ===== DELETE PHOTO =====
  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this photo?')) return;

    setIsDeleting(true);
    setError(null); // Clear previous errors

    try {
      await deletePhoto(photoId); // call API
      onSuccess(); //refresh UI
    } catch (err) {
      setError(err.message || 'Failed to delete photo');
    } finally {
      setIsDeleting(false); // Reset deleting state
    }
  };

   // ===== ADD PHOTO TO GALLERY =====
  const handleAddToGallery = async (e) => {
    e.stopPropagation();
    if (!selectedGallery) return; // Exit early if condition is not met

    setIsAddingToGallery(true);
    setError(null); // Clear previous errors
    
    try {
      const response = await fetch(`${API_BASE}/gallery/${selectedGallery}/add-photo`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Add auth header
        },
        body: JSON.stringify({ photoId }) // send photo ID
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to add to gallery');
      }

      alert('Added to gallery successfully!');
      onSuccess(); // callback to refresh UI
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAddingToGallery(false); // Reset state
    }
  };

  return (
    <div 
      className="absolute top-2 right-2 space-y-2"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Gallery selector Dropdown and button to add photo to gallery */}
      {galleries?.length > 0 && (
        <div className="flex gap-1 bg-white bg-opacity-70 p-1 rounded">
          <select 
            value={selectedGallery}
            onChange={(e) => setSelectedGallery(e.target.value)}
            className="text-xs p-1 border rounded"
            disabled={isAddingToGallery}
          >
            <option value="">Add to...</option>
            {galleries.map(gallery => (
              <option key={gallery._id} value={gallery.url}>
                {gallery.title}
              </option>
            ))}
          </select>
          <button 
            onClick={handleAddToGallery}
            disabled={!selectedGallery || isAddingToGallery}
            className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
            title="Add to gallery"
          >
            <FontAwesomeIcon icon={faBookmark} size="xs"/>
            {isAddingToGallery && '...'}
          </button>
        </div>
      )}

      {/* Delete button to photo */}
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="block ml-auto text-red-600 hover:text-red-800 disabled:opacity-50"
        title="Delete photo"
      >
        <FontAwesomeIcon icon={faTrash} />
        {isDeleting && <span className="ml-1">...</span>}
      </button>

      {/* display error message */}
      {error && (
        <div className="absolute top-full right-0 mt-1 bg-red-100 text-red-800 text-xs p-1 rounded max-w-xs">
          {error}
        </div>
      )}
    </div>
  );
};

export default ImageCard;