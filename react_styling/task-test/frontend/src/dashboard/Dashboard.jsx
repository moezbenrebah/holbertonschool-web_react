import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../util/AuthContext";
import { fetchUserPhotos, fetchGalleries, deleteGallery } from "../util/photoAPI";
import Sidebar from "./components/Sidebar";
import PhotoGrid from "./components/PhotoGrid";
import PhotoModal from "./components/PhotoModal";
import GalleryCard from "../gallery/components/GalleryCard";


const Dashboard = () => {

  // Get authentication status from AuthContext
  const { user, logout, isLoading } = useAuth();
// variables for photo, galleries, select photo, loading errors
  const [photos, setPhotos] = useState([]);
  const [galleries, setGalleries] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate(); // navigate to routes

  // function to load user photos and galleries from the API
const loadPhotos = async () => {
  try {
    setLoading(true);

    // fetch user photos and galleries at the same time
    const [photosData, galleriesData] = await Promise.all([
      fetchUserPhotos(),
      fetchGalleries()
    ]);
    
    // Track which photos are already part of galleries
    const photosInGalleries = new Set();
    galleriesData.forEach(gallery => {
      gallery.photos?.forEach(photo => {
        photosInGalleries.add(photo._id);
      });
    });
    
    // Filter photos that are not already in galleries
    const standalonePhotos = photosData.filter(photo => !photosInGalleries.has(photo._id));
    
    // Update state with filtered photos and galleries
    setPhotos(standalonePhotos);
    setGalleries(galleriesData);
    setError(null);
  } catch (err) {
    setError(err.message);  //// display error message if API call fails
    if (err.message.includes("401")) logout(); // Logout if unauthorized (401 error)
  } finally {
    setLoading(false); // Stop loading once data is ready or if there's an error
  }
};

  // Handle gallery deletion with confirmation
  const handleDeleteGallery = async (galleryId, e) => {
    e.stopPropagation(); //avoid triggering other handlers
    if (!window.confirm("Are you sure you want to delete this gallery?")) return;

    try {
      setDeletingId(galleryId); // Set gallery ID to indicate which gallery is being deleted
      await deleteGallery(galleryId); // Delete gallery by ID
      await loadPhotos(); // Refresh galleries after deletion
    } catch (err) {
      setError(err.message); //display any error msg
    } finally {
      setDeletingId(null); // Reset deleting ID after operation
    }
  };

  // function handle photo removal
  const handleRemovePhoto = async (photoId, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this photo?")) return;

    try {
      await deletePhoto(photoId); // Delete the photo
      await loadPhotos(); // Refresh photos after deletion
    } catch (err) {
      setError(err.message);
    }
  };

  // Redirect to login if not authenticated; otherwise load photos
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login"); // Redirect to login page if the user is not authenticated
    } else if (!isLoading) {
      loadPhotos(); // Load photos and galleries if authenticated
    }
  }, [user, isLoading, navigate, logout]);

  // Show loading error states to display
  if (isLoading) return <div className="grid place-items-center h-screen">Loading session...</div>;
  if (loading) return <div className="p-8">Loading content...</div>;
  if (error) return <div className="p-8 text-red-500">{error.message || "Error"}</div>;

  return (
    <div className="flex min-h-screen font-sans bg-gradient-to-br from-green-200 to-blue-100">
      <Sidebar
        onLogout={logout}
        onUpload={() => navigate("/upload")} // navigate to upload page
      />

      <main className="flex-1 p-8">

        {/* === Galleries Section (only shown if galleries exist) === */}
        {galleries.length > 0 && (
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Your Galleries</h2>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {galleries.map(gallery => (
                <div key={gallery._id} className="h-full">
                  <div
                    className="bg-white h-full flex flex-col justify-between p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer relative"
                    onClick={() => navigate(`/gallery/${gallery.url}`)} // Navigate to individual gallery page
                  >
                    <GalleryCard
                      galleryId={gallery._id} // Pass gallery ID to the GalleryCard
                      onSuccess={loadPhotos}  // Refresh photos after success
                    />
                    <h3 className="font-bold text-lg mb-2">{gallery.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{gallery.description}</p>
                    <div className="text-blue-600 text-sm">View Gallery →</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* === Photos Section === Display the photo grid of given photos */}
        <PhotoGrid
          photos={photos} // Pass the filtered
          onPhotoClick={setSelectedPhoto} // Set selected photo for modal view
          refreshPhotos={loadPhotos} // refresh photo
          galleries={galleries} // // Pass galleries to PhotoGrid
          handleRemovePhoto={handleRemovePhoto} // handle photo removal
        />

        {/* === Display the photo modal if a photo is selected === */}
        {selectedPhoto && (
          <PhotoModal
            photo={selectedPhoto} //selected photo to the modal
            onClose={() => setSelectedPhoto(null)} // Close the modal
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;