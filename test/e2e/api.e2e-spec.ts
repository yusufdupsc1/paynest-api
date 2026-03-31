import { Test } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import request from 'supertest';
import { GatewayType, WebhookProcessingStatus } from '../../src/common/types';
import { GatewayService } from '../../src/gateways/gateway.service';
import { HealthController } from '../../src/modules/health/health.controller';
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
import { Reflector } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { canonicalPaymentRequest } from '../fixtures/requests';
import { createTestApp, getAuthToken } from '../helpers/test-app';

describe('API e2e', () => {
  jest.setTimeout(15000);

  const transactionsService = {
    createPayment: jest.fn(),
  };
  const webhooksService = {
    processWebhook: jest.fn(),
    replayWebhook: jest.fn(),
    retryWebhook: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    getBacklogSummary: jest.fn(),
    getReliabilitySummary: jest.fn(),
  };
  const gatewayService = {
    getSupportedGateways: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('allows public health endpoint without auth', async () => {
    webhooksService.getBacklogSummary.mockResolvedValue({
      total: 0, retryable: 0, failed: 0, processing: 0,
      invalidSignature: 0, oldestPendingAt: null,
    });
    webhooksService.getReliabilitySummary.mockResolvedValue({
      status: 'healthy', replayable: 0, blockedReplay: 0, maxRetriesExceeded: 0,
      lastReceivedAt: null, lastProcessedAt: null, backlogAgeSeconds: null,
      recent24h: { received: 0, processed: 0, failed: 0, invalidSignature: 0, replayed: 0 },
    });
    gatewayService.getSupportedGateways.mockReturnValue([
      { type: GatewayType.STRIPE, name: 'Stripe' },
    ]);

    const app = await createTestApp(
      Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: [],
            load: [() => ({ JWT_SECRET: 'test-secret', ADMIN_PASSWORD: 'admin123', OPERATOR_PASSWORD: 'operator123', VIEWER_PASSWORD: 'viewer123' })],
          }),
          PassportModule,
          JwtModule.register({ secret: 'test-secret', signOptions: { expiresIn: '1h' } }),
          ThrottlerModule.forRoot([{ ttl: 60000, limit: 1000 }]),
        ],
        controllers: [HealthController, AuthController],
        providers: [
          Reflector,
          AuthService,
          JwtStrategy,
          LocalStrategy,
          { provide: APP_GUARD, useFactory: () => new JwtAuthGuard(new Reflector()) },
          { provide: APP_GUARD, useFactory: () => new RolesGuard(new Reflector()) },
          { provide: WebhooksService, useValue: webhooksService },
          { provide: GatewayService, useValue: gatewayService },
        ],
      }),
    );

    await request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect(({ body }) => {
        expect(body.status).toBe('ok');
      });

    await app.close();
  });

  it('rejects protected endpoints without auth token', async () => {
    const app = await createTestApp(
      Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({ isGlobal: true, envFilePath: [], load: [() => ({ JWT_SECRET: 'test-secret', ADMIN_PASSWORD: 'admin123', OPERATOR_PASSWORD: 'operator123', VIEWER_PASSWORD: 'viewer123' })] }),
          PassportModule,
          JwtModule.register({ secret: 'test-secret', signOptions: { expiresIn: '1h' } }),
          ThrottlerModule.forRoot([{ ttl: 60000, limit: 1000 }]),
        ],
        controllers: [TransactionsController, AuthController],
        providers: [
          Reflector,
          AuthService,
          JwtStrategy,
          LocalStrategy,
          { provide: APP_GUARD, useFactory: () => new JwtAuthGuard(new Reflector()) },
          { provide: APP_GUARD, useFactory: () => new RolesGuard(new Reflector()) },
          { provide: TransactionsService, useValue: transactionsService },
          { provide: 'REDIS_CLIENT', useValue: null },
        ],
      }),
    );

    await request(app.getHttpServer())
      .get('/transactions')
      .expect(401);

    await request(app.getHttpServer())
      .post('/transactions/initiate')
      .set('idempotency-key', 'test-key')
      .send(canonicalPaymentRequest)
      .expect(401);

    await app.close();
  });

  it('accepts authenticated requests with valid JWT', async () => {
    transactionsService.createPayment.mockResolvedValue({
      id: 'txn-001',
      gateway: GatewayType.STRIPE,
      status: 'pending',
      paymentUrl: 'https://checkout.stripe.test/session_001',
    });

    const app = await createTestApp(
      Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({ isGlobal: true, envFilePath: [], load: [() => ({ JWT_SECRET: 'test-secret', ADMIN_PASSWORD: 'admin123', OPERATOR_PASSWORD: 'operator123', VIEWER_PASSWORD: 'viewer123' })] }),
          PassportModule,
          JwtModule.register({ secret: 'test-secret', signOptions: { expiresIn: '1h' } }),
          ThrottlerModule.forRoot([{ ttl: 60000, limit: 1000 }]),
        ],
        controllers: [TransactionsController, AuthController],
        providers: [
          Reflector,
          AuthService,
          JwtStrategy,
          LocalStrategy,
          { provide: APP_GUARD, useFactory: () => new JwtAuthGuard(new Reflector()) },
          { provide: APP_GUARD, useFactory: () => new RolesGuard(new Reflector()) },
          { provide: TransactionsService, useValue: transactionsService },
          { provide: 'REDIS_CLIENT', useValue: null },
        ],
      }),
    );

    const token = await getAuthToken(app);

    await request(app.getHttpServer())
      .post('/transactions/initiate')
      .set('Authorization', `Bearer ${token}`)
      .set('idempotency-key', 'idem-e2e-001')
      .set('Content-Type', 'application/json; charset=utf-8')
      .send(canonicalPaymentRequest)
      .expect(201)
      .expect(({ body }) => {
        expect(body.success).toBe(true);
        expect(body.transaction.id).toBe('txn-001');
      });

    await app.close();
  });

  it('allows webhook replay only with admin/operator role', async () => {
    webhooksService.replayWebhook.mockResolvedValue({
      success: true,
      status: WebhookProcessingStatus.PROCESSED,
    });

    const app = await createTestApp(
      Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({ isGlobal: true, envFilePath: [], load: [() => ({ JWT_SECRET: 'test-secret', ADMIN_PASSWORD: 'admin123', OPERATOR_PASSWORD: 'operator123', VIEWER_PASSWORD: 'viewer123' })] }),
          PassportModule,
          JwtModule.register({ secret: 'test-secret', signOptions: { expiresIn: '1h' } }),
          ThrottlerModule.forRoot([{ ttl: 60000, limit: 1000 }]),
        ],
        controllers: [WebhooksController, AuthController],
        providers: [
          Reflector,
          AuthService,
          JwtStrategy,
          LocalStrategy,
          { provide: APP_GUARD, useFactory: () => new JwtAuthGuard(new Reflector()) },
          { provide: APP_GUARD, useFactory: () => new RolesGuard(new Reflector()) },
          { provide: WebhooksService, useValue: webhooksService },
        ],
      }),
    );

    const adminToken = await getAuthToken(app, 'admin', 'admin123');

    await request(app.getHttpServer())
      .post('/webhooks/admin/webhook-event-001/replay')
      .set('Authorization', `Bearer ${adminToken}`)
      .set('Content-Type', 'application/json; charset=utf-8')
      .send({ reason: 'regression_verification' })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          status: WebhookProcessingStatus.PROCESSED,
        });
      });

    const viewerToken = await getAuthToken(app, 'viewer', 'viewer123');

    await request(app.getHttpServer())
      .post('/webhooks/admin/webhook-event-001/replay')
      .set('Authorization', `Bearer ${viewerToken}`)
      .set('Content-Type', 'application/json; charset=utf-8')
      .send({ reason: 'should_fail' })
      .expect(403);

    await app.close();
  });

  it('provides full workflow through authenticated endpoints', async () => {
    webhooksService.getBacklogSummary.mockResolvedValue({
      total: 2, retryable: 1, failed: 1, processing: 0,
      invalidSignature: 0, oldestPendingAt: '2026-03-21T12:00:00.000Z',
    });
    webhooksService.getReliabilitySummary.mockResolvedValue({
      status: 'active', replayable: 7, blockedReplay: 0, maxRetriesExceeded: 0,
      lastReceivedAt: '2026-03-21T12:15:00.000Z', lastProcessedAt: '2026-03-21T12:14:30.000Z',
      backlogAgeSeconds: 90,
      recent24h: { received: 11, processed: 10, failed: 1, invalidSignature: 0, replayed: 1 },
    });
    webhooksService.findAll.mockResolvedValue({
      data: [{ id: 'webhook-event-001', gateway: GatewayType.STRIPE, status: WebhookProcessingStatus.PROCESSED }],
      total: 1, page: 1, limit: 10,
      summary: { total: 1, replayable: 1, retryable: 0, byGateway: { [GatewayType.STRIPE]: 1 }, byStatus: { [WebhookProcessingStatus.PROCESSED]: 1 }, bySignatureStatus: { valid: 1 } },
    });
    webhooksService.findOne.mockResolvedValue({
      id: 'webhook-event-001', gateway: GatewayType.STRIPE, status: WebhookProcessingStatus.PROCESSED, replayCount: 1,
    });
    transactionsService.createPayment.mockResolvedValue({
      id: 'txn-001', gateway: GatewayType.STRIPE, status: 'pending', paymentUrl: 'https://checkout.stripe.test/session_001',
    });
    gatewayService.getSupportedGateways.mockReturnValue([
      { type: GatewayType.STRIPE, name: 'Stripe' },
    ]);

    const app = await createTestApp(
      Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({ isGlobal: true, envFilePath: [], load: [() => ({ JWT_SECRET: 'test-secret', ADMIN_PASSWORD: 'admin123', OPERATOR_PASSWORD: 'operator123', VIEWER_PASSWORD: 'viewer123' })] }),
          PassportModule,
          JwtModule.register({ secret: 'test-secret', signOptions: { expiresIn: '1h' } }),
          ThrottlerModule.forRoot([{ ttl: 60000, limit: 1000 }]),
        ],
        controllers: [TransactionsController, WebhooksController, HealthController, AuthController],
        providers: [
          Reflector,
          AuthService,
          JwtStrategy,
          LocalStrategy,
          { provide: APP_GUARD, useFactory: () => new JwtAuthGuard(new Reflector()) },
          { provide: APP_GUARD, useFactory: () => new RolesGuard(new Reflector()) },
          { provide: TransactionsService, useValue: transactionsService },
          { provide: WebhooksService, useValue: webhooksService },
          { provide: GatewayService, useValue: gatewayService },
          { provide: 'REDIS_CLIENT', useValue: null },
        ],
      }),
    );

    const token = await getAuthToken(app);

    await request(app.getHttpServer())
      .get('/health')
      .expect(200);

    await request(app.getHttpServer())
      .post('/transactions/initiate')
      .set('Authorization', `Bearer ${token}`)
      .set('idempotency-key', 'idem-e2e-001')
      .set('Content-Type', 'application/json; charset=utf-8')
      .send(canonicalPaymentRequest)
      .expect(201)
      .expect(({ body }) => {
        expect(body.success).toBe(true);
      });

    await request(app.getHttpServer())
      .get('/webhooks?gateway=stripe&limit=10')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.total).toBe(1);
      });

    await request(app.getHttpServer())
      .get('/webhooks/webhook-event-001')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.id).toBe('webhook-event-001');
      });

    await app.close();
  });
});
