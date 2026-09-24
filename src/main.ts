import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { configureApp } from './app.factory';

const REQUIRED_VARS = [
  'DATABASE_URL',
  'DB_HOST',
  'DB_PORT',
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_DATABASE',
  'DB_SYNCHRONIZE',
  'REDIS_URL',
  'REDIS_HOST',
  'REDIS_PORT',
  'REDIS_PASSWORD',
  'REDIS_TLS',
  'JWT_SECRET',
  'ADMIN_PASSWORD',
  'OPERATOR_PASSWORD',
  'VIEWER_PASSWORD',
  'STRIPE_API_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'PAYPAL_CLIENT_ID',
  'PAYPAL_CLIENT_SECRET',
  'PAYPAL_WEBHOOK_ID',
  'PAYPAL_ENVIRONMENT',
  'RAZORPAY_KEY_ID',
  'RAZORPAY_KEY_SECRET',
  'RAZORPAY_WEBHOOK_SECRET',
  'APP_URL',
  'APP_ORIGIN',
  'CORS_ORIGIN',
  'JWT_EXPIRES_IN',
  'NODE_ENV',
];

function auditEnv() {
  const logger = new Logger('EnvAudit');
  logger.log('=== Environment Variable Audit ===');
  for (const name of REQUIRED_VARS) {
    const value = process.env[name];
    const status = value ? 'SET' : 'MISSING';
    const masked = value ? (value.length > 8 ? value.slice(0, 4) + '****' + value.slice(-4) : '****') : '—';
    logger.log(`${name}: ${status} (${masked})`);
  }
  logger.log('=== End Audit ===');
}

async function bootstrap() {
  auditEnv();
  const logger = new Logger('Bootstrap');
  const app = configureApp(await NestFactory.create(AppModule, { bodyParser: false }));

  app.use(helmet());

  app.use(helmet());

  // Global API prefix — all routes except health/docs get /api/v1
  app.setGlobalPrefix('api/v1', {
    exclude: ['health', 'health/(.*)', 'docs', 'docs/(.*)'],
  });

  const config = new DocumentBuilder()
    .setTitle('PayNest - Payment Dashboard API')
    .setDescription('Unified payment gateway orchestration API')
    .setVersion('1.0')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .addTag('auth', 'Authentication')
    .addTag('transactions', 'Transaction management')
    .addTag('webhooks', 'Webhook receivers')
    .addTag('refunds', 'Refund operations')
    .addTag('analytics', 'Analytics and reporting')
    .addTag('health', 'Health checks')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Application running on http://localhost:${port}`);
  logger.log(`API Docs: http://localhost:${port}/docs`);
  logger.log(`API Base: http://localhost:${port}/api/v1`);
}

bootstrap();
