/* ===== PHOTO API SERVICE ===== 
 * Centralized API calls for photo-related operations
 */

// Base API URL for making requests
export const API_BASE = "http://localhost:5000/api";

/* ===== CLOUDINARY PHOTO OPERATIONS ===== */

// Fetch all photos for the current user
export const fetchUserPhotos = async () => {
  try {
    // Get the token from localStorage to authorize the request
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/posts`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Handle failed response
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch photos');
    }

    // Return the photos data
    return await response.json();
  } catch (error) {
    console.error('Fetch photos error:', error);
    throw error;
  }
};

/* ===== DELETE PHOTO ===== */

// Delete a specific photo
export const deletePhoto = async (photoId) => {
  try {
    // Get the token from localStorage for authorization
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/posts/${photoId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    // failed response
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to delete photo');
    }

    // Return success response
    return await response.json();
  } catch (error) {
    console.error('Delete photo error:', error);
    throw error;
  }
};

/* ===== GALLERY OPERATIONS ===== */

// Fetch all galleries (for dashboard listing)
export const fetchGalleries = async () => {
  try {
    // Get the token for authorization
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/gallery`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) { // error response
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch galleries');
    }

    return await response.json(); // return galleries data
  } catch (error) {
    console.error('Fetch galleries error:', error);
    throw error;
  }
};

// Fetch single gallery by URL (for gallery detail page)

export const fetchGalleryByUrl = async (url) => {
  try {
     // Get the token for authorization
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/gallery/${url}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Gallery not found');
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch gallery error:', error);
    throw error;
  }
};

/* ===== DELETE GALLERY ===== */

// Delete a specific gallery
export const deleteGallery = async (_id) => {
  try {
    // Get the token for authorization
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/gallery/${_id}`, {
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to delete gallery (Status: ${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error('Delete gallery error:', error);
    throw new Error(error.message || 'Failed to delete gallery. Please try again.');
  }
};