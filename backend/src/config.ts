import { CookieOptions } from 'express'
import ms from 'ms'
import { randomBytes } from 'crypto'

export const { PORT = '3000' } = process.env
export const { DB_ADDRESS = 'mongodb://127.0.0.1:27017/weblarek' } = process.env
export const { JWT_SECRET = 'JWT_SECRET' } = process.env
export const ACCESS_TOKEN = {
    secret: process.env.AUTH_ACCESS_TOKEN_SECRET || 'secret-dev',
    expiry: process.env.AUTH_ACCESS_TOKEN_EXPIRY || '10m',
}
export const REFRESH_TOKEN = {
    secret: process.env.AUTH_REFRESH_TOKEN_SECRET || 'secret-dev',
    expiry: process.env.AUTH_REFRESH_TOKEN_EXPIRY || '7d',
    cookie: {
        name: 'refreshToken',
        options: {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            maxAge: ms(process.env.AUTH_REFRESH_TOKEN_EXPIRY || '7d'),
            path: '/',
        } as CookieOptions,
    },
}
export const { ORIGIN_ALLOW = "http://localhost:5173" } = process.env;

export const fileConfig = {    
    minSizeFile: Number(process.env.MIN_SIZE_FILE) || 2048,//2КБ
    maxSizeFile: Number(process.env.MAX_SIZE_FILE) || 10485760,//10МБ    
    uploadPath: process.env.UPLOAD_PATH ||'images',
    uploadPathTemp: process.env.UPLOAD_PATH_TEMP ||'temp'
}

export const RATE_LIMIT = {    
        windowMs: 15 * 60 * 1000,
        limit: 50,
        standardHeaders: true,
        legacyHeaders: false,    
}

export const CORS_OPTION = {
    origin: process.env.ORIGIN_ALLOW || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    exposedHeaders: ['set-cookie'],
}

export const LIMIT_JSON = '10kb'

export const { CSRF_SECRET = randomBytes(32).toString('hex') } = process.env;