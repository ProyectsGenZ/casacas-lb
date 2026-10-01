import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';

/**
 * Sube una imagen a Firebase Cloud Storage manteniendo el 100% de la calidad original.
 * Sin compresión, sin pérdida de resolución y respetando el formato nativo del archivo (PNG, JPG, WebP, etc.).
 */
export const uploadImageToFirebaseStorage = async (
  file: File,
  folder: 'products' | 'settings' | 'categories' | 'reviews' = 'products'
): Promise<string> => {
  try {
    // Nombre limpio y único con timestamp para evitar colisiones
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
    const storagePath = `${folder}/${Date.now()}_${sanitizedName}`;
    const storageRef = ref(storage, storagePath);

    // Se sube el archivo ORIGINAL completo directamente a Firebase Storage
    const uploadResult = await uploadBytes(storageRef, file, {
      contentType: file.type || 'image/jpeg',
      customMetadata: {
        originalName: file.name,
        originalSize: String(file.size),
        uploadedAt: new Date().toISOString()
      }
    });

    // Obtener la URL pública de descarga permanente desde Firebase Storage
    const downloadUrl = await getDownloadURL(uploadResult.ref);
    return downloadUrl;
  } catch (err) {
    console.warn('Firebase Storage upload warning (fallback to raw file read):', err);
    // En caso de fallo de red o permisos, respaldo directo sin compresión
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
};
