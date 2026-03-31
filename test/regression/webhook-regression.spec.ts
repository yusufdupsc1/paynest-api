import { Test } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { Reflector } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import request from 'supertest';
import { GatewayType, WebhookProcessingStatus } from '../../src/common/types';
import { GatewayService } from '../../src/gateways/gateway.service';
import { HealthController } from '../../src/modules/health/health.controller';
import { WebhooksController } from '../../src/modules/webhooks/webhooks.controller';
import { WebhooksService } from '../../src/modules/webhooks/webhooks.service';
import { AuthController } from '../../src/modules/auth/auth.controller';
import { AuthService } from '../../src/modules/auth/auth.service';
import { JwtStrategy } from '../../src/modules/auth/strategies/jwt.strategy';
import { LocalStrategy } from '../../src/modules/auth/strategies/local.strategy';
import { JwtAuthGuard } from '../../src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../src/modules/auth/guards/roles.guard';
import { createTestApp, getAuthToken, API_PREFIX } from '../helpers/test-app';

describe('Webhook regression contracts', () => {
  it('keeps replay and backlog contracts stable for hardened webhook flows', async () => {
    const webhooksService = {
      replayWebhook: jest.fn().mockResolvedValue({
        success: false,
        message: 'Invalid signature events cannot be replayed',
        status: WebhookProcessingStatus.INVALID_SIGNATURE,
      }),
      getBacklogSummary: jest.fn().mockResolvedValue({
        total: 1, retryable: 0, failed: 0, processing: 0,
        invalidSignature: 1, oldestPendingAt: null,
      }),
      getReliabilitySummary: jest.fn().mockResolvedValue({
        status: 'attention', replayable: 0, blockedReplay: 1, maxRetriesExceeded: 0,
        lastReceivedAt: '2026-03-21T12:00:00.000Z', lastProcessedAt: null,
        backlogAgeSeconds: null,
        recent24h: { received: 1, processed: 0, failed: 0, invalidSignature: 1, replayed: 0 },
      }),
      processWebhook: jest.fn(),
      retryWebhook: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
    };
    const gatewayService = {
      getSupportedGateways: jest.fn().mockReturnValue([{ type: GatewayType.STRIPE, name: 'Stripe' }]),
    };

    const app = await createTestApp(
      Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({ isGlobal: true, envFilePath: [], load: [() => ({ JWT_SECRET: 'test-secret', ADMIN_PASSWORD: 'admin123', OPERATOR_PASSWORD: 'operator123', VIEWER_PASSWORD: 'viewer123' })] }),
          PassportModule,
          JwtModule.register({ secret: 'test-secret', signOptions: { expiresIn: '1h' } }),
          ThrottlerModule.forRoot([{ ttl: 60000, limit: 1000 }]),
        ],
        controllers: [WebhooksController, HealthController, AuthController],
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

    const token = await getAuthToken(app);

    await request(app.getHttpServer())
      .post(`${API_PREFIX}/webhooks/admin/webhook-event-invalid/replay`)
      .set('Authorization', `Bearer ${token}`)
      .send({ reason: 'verify_invalid_signature_guard' })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          message: 'Invalid signature events cannot be replayed',
          status: WebhookProcessingStatus.INVALID_SIGNATURE,
        });
      });

    // Health is excluded from prefix
    await request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect(({ body }) => {
        expect(body.webhooks.backlog).toEqual({
          total: 1, retryable: 0, failed: 0, processing: 0,
          invalidSignature: 1, oldestPendingAt: null,
        });
        expect(body.webhooks.reliability.status).toBe('attention');
      });

    await app.close();
  });
});
