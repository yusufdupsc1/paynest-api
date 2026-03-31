import { INestApplication } from '@nestjs/common';
import { TestingModuleBuilder } from '@nestjs/testing';
import { configureApp } from '../../src/app.factory';
import request from 'supertest';

const API_PREFIX = '/api/v1';

export async function createTestApp(
  builder: TestingModuleBuilder,
): Promise<INestApplication> {
  const moduleRef = await builder.compile();
  const app = configureApp(moduleRef.createNestApplication());

  // Apply the same global prefix as production
  app.setGlobalPrefix(API_PREFIX, {
    exclude: ['health', 'health/(.*)', 'docs', 'docs/(.*)'],
  });

  await app.init();
  return app;
}

export async function getAuthToken(
  app: INestApplication,
  username: string = 'admin',
  password: string = 'admin123',
): Promise<string> {
  const response = await request(app.getHttpServer())
    .post(`${API_PREFIX}/auth/login`)
    .send({ username, password });

  return response.body.accessToken as string;
}

export { API_PREFIX };
