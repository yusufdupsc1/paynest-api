import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { configureApp } from './app.factory';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = configureApp(await NestFactory.create(AppModule));

  app.use(helmet());

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
}

bootstrap();
