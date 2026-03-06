import { doubleCsrf, DoubleCsrfConfigOptions } from 'csrf-csrf';
import { Request } from 'express'

// Функция для получения секрета (обязательное поле)
const getSecret = () => '___Secret___';

// Функция для идентификации сессии (обязательное поле)
const getSessionIdentifier = (req: Request) => {
  // Используем IP-адрес и User-Agent для идентификации сессии
  return `${req.ip}|${req.get('User-Agent')}`;
};

const getCsrfTokenFromRequest = (req: Request) => {
  return req.body?.csrfToken || req.headers['x-csrf-token'];
};

const csrfConfig: DoubleCsrfConfigOptions = {
    getSecret,
    getSessionIdentifier,
    getCsrfTokenFromRequest,
    cookieName: '_csrf',
    cookieOptions: {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
    }
};

const { doubleCsrfProtection: csrfProtection, generateCsrfToken } = doubleCsrf(csrfConfig);
export { csrfProtection, generateCsrfToken }
