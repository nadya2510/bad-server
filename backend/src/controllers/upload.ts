import { NextFunction, Request, Response } from 'express'
import { constants } from 'http2'
import BadRequestError from '../errors/bad-request-error'

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
        const fileName = process.env.UPLOAD_PATH
            ? `/${process.env.UPLOAD_PATH}/${req.file.filename}`
            : `/${req.file?.filename}`
        return res.status(constants.HTTP_STATUS_CREATED).send({
            fileName,
            originalName: req.file?.originalname,
        })
    } catch (error) {
        return next(error)
    }
}

export default {}
