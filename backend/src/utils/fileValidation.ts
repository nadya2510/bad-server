import { Buffer } from 'buffer';

export type typesFile = 'image/png' | 'image/jpeg' | 'image/jpg' | 'image/gif' | 'image/svg+xml';

const imageSignatures: Record<typesFile, number[]> = {
  'image/png': [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
  'image/jpeg': [0xff, 0xd8, 0xff],
  'image/jpg': [0xff, 0xd8, 0xff],
  'image/gif': [0x47, 0x49, 0x46, 0x38],
  'image/svg+xml': [0x3c, 0x3f, 0x78, 0x6d, 0x6c],
};

export const validateImageSignature = (buffer: Buffer | null | undefined, mimeType: string): boolean => {
  // Защита от пустого буфера
  if (!buffer || buffer.length === 0) {
    return false;
  }

  const normalizedMimeType = mimeType.toLowerCase() as typesFile;

  // Проверяем, что тип поддерживается
  if (!(normalizedMimeType in imageSignatures)) {
    return true; 
  }

  const signature = imageSignatures[normalizedMimeType];
  if (!signature || signature.length === 0) {
    return true;
  }

  // Сравниваем только первые N байт (длину сигнатуры) или длину буфера, если он короче
  const bytesToCompare = Math.min(signature.length, buffer.length);
  return Array.from({ length: bytesToCompare }, (_, i) => i)
    .every(index => buffer[index] === signature[index]);
};