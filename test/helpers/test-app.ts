import { INestApplication } from '@nestjs/common';
import { TestingModuleBuilder } from '@nestjs/testing';
import { configureApp } from '../../src/app.factory';
import request from 'supertest';

export async function createTestApp(
  builder: TestingModuleBuilder,
): Promise<INestApplication> {
  const moduleRef = await builder.compile();
  const app = configureApp(moduleRef.createNestApplication());
  await app.init();
  return app;
}

export async function getAuthToken(
  app: INestApplication,
  username: string = 'admin',
  password: string = 'admin123',
): Promise<string> {
  const response = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ username, password });

  return response.body.accessToken as string;
}
