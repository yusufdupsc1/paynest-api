import { INestApplication, ValidationPipe } from '@nestjs/common';

const DEFAULT_ALLOWED_ORIGINS = ['http://localhost:3000'];

function resolveAllowedOrigins(): string[] {
  return (process.env.APP_ORIGIN || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export function configureApp<T extends INestApplication>(app: T): T {
  const allowedOrigins = resolveAllowedOrigins();

  app.enableCors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : DEFAULT_ALLOWED_ORIGINS,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
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
