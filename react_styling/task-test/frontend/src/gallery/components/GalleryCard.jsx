import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { deleteGallery } from '../../util/photoAPI';

/* ===== GALLERY CARD COMPONENT ===== */
/**
 * Handles gallery deletion with confirmation
 * Shows delete button, confirmation, loading state, error messages
 */
const GalleryCard = ({ galleryId, onSuccess }) => {
  // State to manage deletion loading state
  const [isDeleting, setIsDeleting] = useState(false);

  //store error massage(if any)
  const [error, setError] = useState(null);

  /* ===== DELETE HANDLER ===== */
  // handle delete button click
  const handleDelete = async (e) => {
    e.stopPropagation(); // Stop the click from affecting other elements

    // ask user confirmation before deleting 
    if (!window.confirm('Are you sure you want to delete this gallery?')) {
      return;
    }
    
    // Start deletion & clear previous errors
    setIsDeleting(true);
    setError(null);
    
    try {
      // call API to delete gallery by ID
      await deleteGallery(galleryId);
      onSuccess(); // call the success callback passed from parent
    } catch (err) {
      setError(err.message); // show error 
    } finally {
      setIsDeleting(false); //reset loading state
    }
  };

  return (
    <div 
      className="absolute top-2 right-2 rounded-full p-2"
      onClick={(e) => e.stopPropagation()}
    >

      {/* Delete button */}
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-red-600 hover:text-red-800 transition-colors"
        title="Delete gallery"
        aria-label="Delete gallery"
      >
        <FontAwesomeIcon icon={faTrash} />
        {isDeleting && <span className="ml-1">...</span>}
      </button>
      
      {/* Show error if exists */}
      {error && (
        <div className="absolute top-full right-0 mt-1 bg-red-100 text-red-800 text-xs p-1 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default GalleryCard;