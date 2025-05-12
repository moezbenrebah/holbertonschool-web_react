//----- uploadFile -----//
// uploader un fichier sur le serveur //

export const uploadFileToServer = async (file: File): Promise<string | null> => {
	const fileToBase64 = (file: File): Promise<string> => {
	  return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = (error) => reject(error);
	  });
	};

	try {
	  const response = await fetch('/api/media/upload', {
		method: 'POST',
		body: JSON.stringify({ file: await fileToBase64(file) }),
		headers: { 'Content-Type': 'application/json' },
	  });

	  const data = await response.json();
	  return data.url || null;
	} catch (error) {
	  console.error('Erreur lors de l\'upload :', error);
	  return null;
	}
  };

export async function uploadToCloudinary(file: File, uploadPreset: string) {
  console.log('🚀 Début upload Cloudinary');
  console.log('📦 File:', { name: file.name, size: file.size, type: file.type });
  console.log('🔑 Upload preset:', uploadPreset);
  console.log('☁️ Cloud name:', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
  console.log('🔗 URL:', url);

  try {
    console.log('📤 Envoi de la requête...');
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      mode: 'cors',
      headers: {
        'Accept': 'application/json'
      }
    });

    console.log('📥 Réponse reçue:', {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erreur réponse:', errorText);
      throw new Error(`Erreur Cloudinary: ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Upload réussi:', data);
    return data;

  } catch (error) {
    console.error('❌ Erreur détaillée:', {
      error,
      message: error instanceof Error ? error.message : 'Erreur inconnue',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
}
