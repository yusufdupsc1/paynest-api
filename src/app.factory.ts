import { INestApplication, ValidationPipe } from '@nestjs/common';
import express from 'express';
import type { Request } from 'express';

const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
];

function resolveAllowedOrigins(): string[] {
  const envOrigins = (process.env.CORS_ORIGIN || process.env.APP_ORIGIN || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return envOrigins.length > 0 ? envOrigins : DEFAULT_ALLOWED_ORIGINS;
}

export function configureApp<T extends INestApplication>(app: T): T {
  const allowedOrigins = resolveAllowedOrigins();

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization', 'Idempotency-Key', 'Stripe-Signature', 'X-Razorpay-Signature'],
    credentials: true,
    maxAge: 86400,
  });

  // Capture the raw request body on `req.rawBody` so webhook signature verification
  // can operate on the exact byte sequence received from the gateway. A single JSON
  // parser with a `verify` hook replaces Nest's default body parser.
  app.use(
    express.json({
      limit: '1mb',
      verify: (req: Request, _res, buf) => {
        (req as Request & { rawBody?: Buffer }).rawBody = buf;
      },
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  return app;
}
