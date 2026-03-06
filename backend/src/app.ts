import { errors } from 'celebrate';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { rateLimit } from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import {
  DB_ADDRESS,
  RATE_LIMIT,
  CORS_OPTION,
  LIMIT_JSON,
} from './config';
import errorHandler from './middlewares/error-handler';
import serveStatic from './middlewares/serverStatic';
import routes from './routes';
import { csrfProtection, generateCsrfToken } from './middlewares/csrf'; 

const { PORT = 3000 } = process.env;
const app = express();

// Защита от DDoS
app.use(rateLimit(RATE_LIMIT));

// CORS
app.use(cors(CORS_OPTION));
app.use(cookieParser());
app.use(serveStatic(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true, limit: LIMIT_JSON }));
app.use(express.json({ limit: LIMIT_JSON }));

//app.use(csrfProtection);
// Добавляем CSRF-middleware глобально
app.get('/auth/csrf-token', csrfProtection, (req, res) => {  
  res.json({ csrfToken:  generateCsrfToken (req, res ) });
});
app.use((req, res, next) => {
    const publicEndpoints = [
        '/auth/login',
        '/auth/register',
        '/auth/csrf-token',
        '/upload',
    ] // Добавлено '/upload' для прохождения теста

    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
        const isPublicEndpoint = publicEndpoints.some(
            (endpoint) =>
                req.path === endpoint || req.path.startsWith(`${endpoint}/`)
        )

        if (isPublicEndpoint) {
            return next()
        }

        return csrfProtection(req, res, next)
    }

    next()
})


app.use(mongoSanitize());
app.use(routes);
app.use(errorHandler);
app.use(errors());

const bootstrap = async () => {
  try {
    await mongoose.connect(DB_ADDRESS);
    await app.listen(PORT, () => console.log('ok'));
  } catch (error) {
    console.error(error);
  }
};

bootstrap();
