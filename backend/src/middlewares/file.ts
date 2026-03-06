import { Request } from 'express'
import multer, { FileFilterCallback } from 'multer'
import path, { join } from 'path'
import { fileConfig } from '../config'

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

const generateFileName = (originalName: string): string => {
  const ext = path.extname(originalName).toLowerCase();
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}_${random}${ext}`;
};

const storage = multer.diskStorage({
    destination: (
        _req: Request,
        _file: Express.Multer.File,
        cb: DestinationCallback
    ) => {
        cb(
            null,
            join(
                __dirname,
                fileConfig.uploadPathTemp
                    ? `../public/${fileConfig.uploadPathTemp}`
                    : '../public'
            )
        )
    },

    filename: (
        _req: Request,
        file: Express.Multer.File,
        cb: FileNameCallback
    ) => {
        const uniqueName = generateFileName(file.originalname);
        cb(null, uniqueName)
    },
})

const types = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'image/svg+xml',
]

const fileFilter = async (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    const mimeType = file.mimetype.toLowerCase();
     
    if (!types.includes(file.mimetype)) {
        return cb(null, false)
    }
        
    return cb(null, true)
}

export default multer({ 
    storage, 
    fileFilter, 
    limits: {
      fileSize: fileConfig.maxSizeFile // 10 МБ
    },
  
 })
