import { ErrorRequestHandler } from 'express'
import { isCelebrateError } from 'celebrate';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import NotFoundError from '../errors/not-found-error';
import UnauthorizedError from '../errors/unauthorized-error';

const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {

    let statusCode = err.statusCode || 500
    let message =
        statusCode === 500 ? `На сервере произошла ошибка: ${err.message}` : err.message
    

    const errorTypes = [BadRequestError, ConflictError, NotFoundError, UnauthorizedError];
    

    if (errorTypes.some((type) => err instanceof type)) {
      statusCode = err.statusCode;
      message = err.message;
    } else if (isCelebrateError(err)) {
      statusCode = 400;
      message = 'Ошибка валидации';
      [...err.details.keys()].forEach((key) => {
        const errorKey = err.details.get(key);
        if (errorKey && errorKey.details && errorKey.details.length > 0) {
          message = errorKey.details[0].message;
        }
      });
    }

    console.error(`[${_req.method}] ${_req.path} | ${statusCode} | ${err.message}`);

    res.status(statusCode).send({ message })

    next()
}

export default errorHandler
