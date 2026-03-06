import { NextFunction, Request, Response } from 'express'
import { constants } from 'http2'
import fs from 'node:fs/promises'
import { validateImageSignature } from '../utils/fileValidation'
import BadRequestError from '../errors/bad-request-error'
import { fileConfig } from '../config'

export const uploadFile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {    
    if (!req.file) {
        return next(new BadRequestError('Файл не загружен'))
    }

    if (req.file.size < fileConfig.minSizeFile) {
        await fs.unlink(req.file.path)
        return next(new BadRequestError('Размер файла слишком мал'))
    }

    const filePath = req.file.path;
    const mimeType = req.file.mimetype.toLowerCase();

    // Читаем первые 10 байт для проверки сигнатуры
    const buffer = await fs.readFile(filePath);
    if (!validateImageSignature(buffer, mimeType)) {
      // Удаляем файл при неудачной проверке
      await fs.unlink(filePath);
      return next(new BadRequestError('Некорректная сигнатура файла'));
    }

    try {
        const fileName = fileConfig.uploadPath
            ? `/${fileConfig.uploadPath}/${req.file.filename}`
            : `/${req.file?.filename}`
        return res.status(constants.HTTP_STATUS_CREATED).send({
            fileName,
            originalName: req.file?.originalname,
        })
    } catch (error) {
        return next(new BadRequestError('Файл не загружен'))//next(error)
    }
}

export default {}