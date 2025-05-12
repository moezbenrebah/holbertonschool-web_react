export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
  apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
};

// Vérification au démarrage
console.log('🔧 Configuration Cloudinary:', {
  cloudName: cloudinaryConfig.cloudName ? '✅' : '❌',
  uploadPreset: cloudinaryConfig.uploadPreset ? '✅' : '❌',
  apiKey: cloudinaryConfig.apiKey ? '✅' : '❌'
});
