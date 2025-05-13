const cloudinary = require('../config/cloudinary');

// Function to upload a file buffer to Cloudinary (folder shutterup)
const uploadToCloudinary = async (fileBuffer, folder = 'shutterup') => {
  return new Promise((resolve, reject) => {

    // Create an upload stream with Cloudinary configuration
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'shutterup', // Upload folder name in Cloudinary
        resource_type: 'auto', // Auto-detect file type
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'], //image formats
        transformation: [{ 
          width: 1200,  // Resize width to 1200px
          crop: 'scale', // Scale to fit width without cropping
          quality: 'auto' // let Cloudinary optimize image quality
        }] 

      },
      (error, result) => {
        if (error) reject(error); // Handle upload error
        else resolve(result); // Return result if successful
      }
    );

// Send the file buffer to Cloudinary through the stream
    uploadStream.end(fileBuffer);
  });
};


module.exports = uploadToCloudinary;