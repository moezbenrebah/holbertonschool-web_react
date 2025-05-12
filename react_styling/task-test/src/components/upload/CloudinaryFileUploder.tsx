import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { uploadToCloudinary } from '@/lib/utils/Upload/uploadFile';

interface CloudinaryFileUploaderProps {
	uploadPreset: string;
  	onUploadSuccess: (url: string) => void;
  	disabled?: boolean;
  	maxSize?: number;
  	existingImageUrl?: string;
}

//  Ajouter un message d'erreur si l'upload ne fonctionne pas
const CloudinaryFileUploader = ({ uploadPreset, onUploadSuccess, disabled = false, maxSize = 5, existingImageUrl }:
	CloudinaryFileUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('🎬 Début du processus d\'upload');

    try {
      const files = e.target.files;
      if (!files?.length) {
        console.log('❌ Pas de fichier sélectionné');
        return;
      }

      const file = files[0];
      console.log('📄 Fichier sélectionné:', {
        name: file.name,
        size: file.size,
        type: file.type
      });

      if (file.size > maxSize * 1024 * 1024) {
        console.log('❌ Fichier trop volumineux');
        toast.error(`Le fichier doit faire moins de ${maxSize}Mo`);
        return;
      }

      if (!file.type.startsWith('image/')) {
        console.log('❌ Type de fichier non autorisé');
        toast.error('Seules les images sont acceptées');
        return;
      }

      console.log('⏳ Début upload...');
      setIsUploading(true);

      const data = await uploadToCloudinary(file, uploadPreset);
      console.log('✅ Upload terminé:', data);

      onUploadSuccess(data.secure_url);
      toast.success('Image téléchargée avec succès');

    } catch (error) {
      console.error('❌ Erreur upload:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors du téléchargement');
    } finally {
      setIsUploading(false);
      console.log('🏁 Fin du processus d\'upload');
    }
  };

  return (
    <div className="w-full bg-white">
      <input
        type="file"
        id="cloudinary-upload"
        className="hidden"
        accept="image/*"
        onChange={handleUpload}
        disabled={disabled || isUploading}
      />
      <Button
        type="button"
        onClick={() => document.getElementById('cloudinary-upload')?.click()}
        disabled={disabled || isUploading}
        className="w-full bg-white text-gray border-2 border-amber-400 shadow-lg rounded-xl hover:bg-amber-400 flex items-center justify-center gap-2"
      >
        {isUploading ? (
          <>
            <div className="w-6 h-6 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
          </>
        ) : (
          <>
            {existingImageUrl ? 'Modifier la photo'	 : 'Ajouter une photo'}
          </>
        )}
      </Button>
    </div>
  );
};

export default CloudinaryFileUploader;
