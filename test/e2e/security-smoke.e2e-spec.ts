import { Test } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { Reflector } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import request from 'supertest';
import { TransactionsController } from '../../src/modules/transactions/transactions.controller';
import { TransactionsService } from '../../src/modules/transactions/transactions.service';
import { WebhooksController } from '../../src/modules/webhooks/webhooks.controller';
import { WebhooksService } from '../../src/modules/webhooks/webhooks.service';
import { AuthController } from '../../src/modules/auth/auth.controller';
import { AuthService } from '../../src/modules/auth/auth.service';
import { JwtStrategy } from '../../src/modules/auth/strategies/jwt.strategy';
import { LocalStrategy } from '../../src/modules/auth/strategies/local.strategy';
import { JwtAuthGuard } from '../../src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../src/modules/auth/guards/roles.guard';
import { canonicalPaymentRequest } from '../fixtures/requests';
import { canonicalStripeWebhookPayload } from '../fixtures/webhooks';
import { createTestApp, getAuthToken, API_PREFIX } from '../helpers/test-app';

describe('Security smoke e2e', () => {
  jest.setTimeout(15000);

  const transactionsService = { createPayment: jest.fn() };
  const webhooksService = {
    processWebhook: jest.fn(),
    replayWebhook: jest.fn(),
    retryWebhook: jest.fn(),
    findAll: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  function buildApp() {
    return createTestApp(
      Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: [],
            load: [() => ({
              JWT_SECRET: 'test-secret',
              ADMIN_PASSWORD: 'admin123',
              OPERATOR_PASSWORD: 'operator123',
              VIEWER_PASSWORD: 'viewer123',
            })],
          }),
          PassportModule,
          JwtModule.register({ secret: 'test-secret', signOptions: { expiresIn: '1h' } }),
          ThrottlerModule.forRoot([{ ttl: 60000, limit: 1000 }]),
        ],
        controllers: [TransactionsController, WebhooksController, AuthController],
        providers: [
          Reflector,
          AuthService,
          JwtStrategy,
          LocalStrategy,
          { provide: APP_GUARD, useFactory: () => new JwtAuthGuard(new Reflector()) },
          { provide: APP_GUARD, useFactory: () => new RolesGuard(new Reflector()) },
          { provide: TransactionsService, useValue: transactionsService },
          { provide: WebhooksService, useValue: webhooksService },
          { provide: 'REDIS_CLIENT', useValue: null },
        ],
      }),
    );
  }

  it('returns 401 for unauthenticated requests to protected endpoints', async () => {
    const app = await buildApp();

    await request(app.getHttpServer())
      .get(`${API_PREFIX}/transactions`)
      .expect(401);

    await request(app.getHttpServer())
      .post(`${API_PREFIX}/transactions/initiate`)
      .set('idempotency-key', 'test-key')
      .send(canonicalPaymentRequest)
      .expect(401);

    await request(app.getHttpServer())
      .get(`${API_PREFIX}/webhooks`)
      .expect(401);

    await app.close();
  });

  it('returns 401 for invalid JWT tokens', async () => {
    const app = await buildApp();

    await request(app.getHttpServer())
      .get(`${API_PREFIX}/transactions`)
      .set('Authorization', 'Bearer invalid-token-here')
      .expect(401);

    await app.close();
  });

  it('allows login with valid credentials', async () => {
    const app = await buildApp();

    const response = await request(app.getHttpServer())
      .post(`${API_PREFIX}/auth/login`)
      .send({ username: 'admin', password: 'admin123' });

    expect(response.status).toBe(201);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.user.username).toBe('admin');
    expect(response.body.user.role).toBe('admin');

    await app.close();
  });

  it('rejects login with invalid credentials', async () => {
    const app = await buildApp();

    await request(app.getHttpServer())
      .post(`${API_PREFIX}/auth/login`)
      .send({ username: 'admin', password: 'wrong-password' })
      .expect(401);

    await app.close();
  });

  it('rejects requests missing required idempotency header when authenticated', async () => {
    const app = await buildApp();
    const token = await getAuthToken(app);

    await request(app.getHttpServer())
      .post(`${API_PREFIX}/transactions/initiate`)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json; charset=utf-8')
      .send(canonicalPaymentRequest)
      .expect(400);

    await app.close();
  });

  it('rejects webhook requests missing required signature headers', async () => {
    webhooksService.processWebhook.mockResolvedValue({ success: true, eventId: 'evt-1', status: 'received' });
    const app = await buildApp();

    await request(app.getHttpServer())
      .post(`${API_PREFIX}/webhooks/stripe`)
      .set('Content-Type', 'application/json; charset=utf-8')
      .send(canonicalStripeWebhookPayload)
      .expect(400);

    await app.close();
  });

  it('returns 403 when viewer tries admin-only action', async () => {
    webhooksService.replayWebhook.mockResolvedValue({ success: true, status: 'processed' });

    const app = await buildApp();
    const viewerToken = await getAuthToken(app, 'viewer', 'viewer123');

    await request(app.getHttpServer())
      .post(`${API_PREFIX}/webhooks/admin/wh-1/replay`)
      .set('Authorization', `Bearer ${viewerToken}`)
      .set('Content-Type', 'application/json; charset=utf-8')
      .send({ reason: 'test' })
      .expect(403);

    await app.close();
  });

  it('allows operator to retry webhooks', async () => {
    webhooksService.retryWebhook.mockResolvedValue({ success: true });

    const app = await buildApp();
    const operatorToken = await getAuthToken(app, 'operator', 'operator123');

    await request(app.getHttpServer())
      .post(`${API_PREFIX}/webhooks/retry/wh-1`)
      .set('Authorization', `Bearer ${operatorToken}`)
      .expect(200);

    await app.close();
  });

  it('allows webhook ingestion without auth (public endpoints)', async () => {
    webhooksService.processWebhook.mockResolvedValue({ success: true, eventId: 'evt-1', status: 'received' });

    const app = await buildApp();

    await request(app.getHttpServer())
      .post(`${API_PREFIX}/webhooks/stripe`)
      .set('stripe-signature', 't=123,v1=sig')
      .set('Content-Type', 'application/json; charset=utf-8')
      .send(canonicalStripeWebhookPayload)
      .expect(200);

    await request(app.getHttpServer())
      .post(`${API_PREFIX}/webhooks/bkash`)
      .set('Content-Type', 'application/json; charset=utf-8')
      .send({ payment_id: 'pay-1', status: 'success' })
      .expect(200);

    await app.close();
  });
});
