import ImageCard from "../../gallery/components/ImageCard";

// PhotoGrid component displays a grid of photos
const PhotoGrid = ({ photos, onPhotoClick, refreshPhotos, galleries, handleRemovePhoto }) => {
  return (

     // Grid layout for displaying photos
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      
      {/* Display each photo and render it */}
      {photos.map((photo) => (
        <div key={photo._id} className="relative group hover:shadow-lg transition-shadow">
          
          {/* handles photo click and styling */}
          <div 
            className="relative w-full h-48 rounded-lg overflow-hidden cursor-pointer"
            onClick={() => onPhotoClick(photo)}
          >
            {/* Display the photo */}
            <img 
              src={photo.imageUrl} 
              alt="User upload"
              className="w-full h-full object-cover"
            />

            {/* Hover overlay with actions (ImageCard) */}

            <div className="absolute inset-0 flex items-end justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ImageCard
                photoId={photo._id}
                onSuccess={refreshPhotos}  // This triggers the refresh of the dashboard
                galleries={galleries}
                handleRemovePhoto={handleRemovePhoto} // Pass the remove handler to ImageCard
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PhotoGrid;
