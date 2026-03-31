import { INestApplication, ValidationPipe } from '@nestjs/common';

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
