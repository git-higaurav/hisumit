import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_NAME, 
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY, 
  api_secret: process.env.NEXT_PUBLIC_COUDINARY_API_SECRECT
});

export async function deleteCloudinaryImage(public_id: string) {
  try {
    // Delete the image from Cloudinary using the provided public_id
    const result = await cloudinary.uploader.destroy(public_id);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
}
