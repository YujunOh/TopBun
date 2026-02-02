'use server';

import { nanoid } from 'nanoid';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
]);

export async function uploadImage(formData: FormData) {
  const file = formData.get('file');

  if (!file || !(file instanceof File)) {
    return { error: 'uploadError' } as const;
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return { error: 'invalidType' } as const;
  }

  if (file.size > MAX_SIZE) {
    return { error: 'fileTooLarge' } as const;
  }

  const extension = ALLOWED_TYPES.get(file.type) ?? 'jpg';
  const filename = `${nanoid(10)}.${extension}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  const filePath = path.join(uploadDir, filename);

  await fs.mkdir(uploadDir, { recursive: true });

  const arrayBuffer = await file.arrayBuffer();
  await fs.writeFile(filePath, Buffer.from(arrayBuffer));

  return { url: `/uploads/${filename}` } as const;
}
