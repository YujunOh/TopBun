'use server';

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function uploadImage(formData: FormData) {
  const file = formData.get('file');

  if (!file || !(file instanceof File)) {
    return { error: 'uploadError' } as const;
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: 'invalidType' } as const;
  }

  if (file.size > MAX_SIZE) {
    return { error: 'fileTooLarge' } as const;
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: 'image',
              folder: 'topbun',
              transformation: [
                { width: 1200, height: 1200, crop: 'limit' },
                { quality: 'auto', fetch_format: 'auto' },
              ],
            },
            (error, result) => {
              if (error || !result) reject(error ?? new Error('Upload failed'));
              else resolve(result as { secure_url: string; public_id: string });
            },
          )
          .end(buffer);
      },
    );

    return { url: result.secure_url } as const;
  } catch (error) {
    console.error('Cloudinary upload failed:', error);
    return { error: 'uploadError' } as const;
  }
}
