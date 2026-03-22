import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FindOptionsWhere, In, IsNull, LessThanOrEqual, MoreThan, Repository } from 'typeorm';
import { WebhookEvent } from './entities/webhook-event.entity';
import { GatewayService } from '../../gateways/gateway.service';
import { TransactionsService } from '../transactions/transactions.service';
import {
  AuditActionType,
  AuditEntityType,
  GatewayType,
  TransactionStatus,
  WebhookBacklogSummary,
  WebhookEventFilters,
  WebhookEventSummary,
  WebhookProcessingStatus,
  WebhookReliabilitySummary,
  WebhookSignatureStatus,
} from '../../common/types';
import { RetryUtil } from '../../common/utils/retry.util';
import { CryptoUtil } from '../../common/utils/crypto.util';
import { AuditService } from '../audit/audit.service';

interface ProcessWebhookPayload {
  gateway: GatewayType;
  payload: string | Record<string, unknown>;
  headers: Record<string, string | string[] | undefined>;
}

interface ProcessWebhookResult {
  success: boolean;
  eventId?: string;
  message?: string;
  status: WebhookProcessingStatus;
}

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);
  private readonly MAX_RETRIES = 5;
  private readonly REPLAYABLE_STATUSES = [
    WebhookProcessingStatus.RECEIVED,
    WebhookProcessingStatus.PROCESSED,
    WebhookProcessingStatus.FAILED,
    WebhookProcessingStatus.DUPLICATE,
  ];

  constructor(
    @InjectRepository(WebhookEvent)
    private readonly webhookEventRepository: Repository<WebhookEvent>,
    private readonly gatewayService: GatewayService,
    private readonly transactionsService: TransactionsService,
    private readonly auditService: AuditService,
  ) {}

  async processWebhook({
    gateway,
    payload,
    headers,
  }: ProcessWebhookPayload): Promise<ProcessWebhookResult> {
    const normalizedHeaders = this.normalizeHeaders(headers);
    const rawBody = typeof payload === 'string' ? payload : JSON.stringify(payload);
    const verification = await this.gatewayService.verifyWebhook(gateway, payload, normalizedHeaders);
    const normalizedEventKey = this.buildNormalizedEventKey(
      gateway,
      verification.eventId,
      verification.eventType,
      verification.payload,
    );
    const persistedEventId = verification.eventId || normalizedEventKey;
    const parsedPayload = (verification.payload || this.parsePayload(payload)) as Record<string, unknown>;

    const existingEvent = await this.webhookEventRepository.findOne({
      where: { gateway, eventId: persistedEventId },
    });

    const event = existingEvent || this.webhookEventRepository.create();
    event.gateway = gateway;
    event.eventId = persistedEventId;
    event.eventType = verification.eventType || event.eventType || 'unknown';
    event.normalizedEventKey = normalizedEventKey;
    event.payload = parsedPayload;
    event.rawBody = rawBody;
    event.headers = normalizedHeaders;
    event.receivedAt = event.receivedAt || new Date();
    event.signatureValid = verification.valid;
    event.signatureStatus = this.resolveSignatureStatus(gateway, verification.valid);

    if (!verification.valid) {
      event.status = WebhookProcessingStatus.INVALID_SIGNATURE;
      event.errorMessage = verification.error || 'Invalid signature';
      event.processingStartedAt = null;
      event.nextRetryAt = null;
      await this.webhookEventRepository.save(event);

      this.logger.warn(`Invalid webhook from ${gateway}: ${verification.error}`);
      return {
        success: false,
        eventId: event.eventId,
        message: event.errorMessage,
        status: event.status,
      };
    }

    if (
      existingEvent &&
      [WebhookProcessingStatus.PROCESSED, WebhookProcessingStatus.DUPLICATE].includes(
        existingEvent.status,
      )
    ) {
      this.logger.log(`Duplicate webhook event ${event.eventId} ignored`);
      return {
        success: true,
        eventId: event.eventId,
        message: 'Duplicate webhook event',
        status: WebhookProcessingStatus.DUPLICATE,
      };
    }

    await this.markEventProcessing(event);

    try {
      await this.processEvent(gateway, event.eventType, parsedPayload);
      await this.markEventProcessed(event);

      return {
        success: true,
        eventId: event.eventId,
        status: event.status,
      };
    } catch (error) {
      await this.markEventFailed(event, error);

      return {
        success: false,
        eventId: event.eventId,
        message: event.errorMessage || 'Unknown error',
        status: event.status,
      };
    }
  }

  private async processEvent(
    gateway: GatewayType,
    eventType: string,
    payload: Record<string, unknown>,
  ): Promise<void> {
    switch (gateway) {
      case GatewayType.STRIPE:
        await this.handleStripeEvent(eventType, payload);
        break;
      case GatewayType.PAYPAL:
        await this.handlePayPalEvent(eventType, payload);
        break;
      case GatewayType.RAZORPAY:
        await this.handleRazorpayEvent(eventType, payload);
        break;
      case GatewayType.BKASH:
        await this.handleBkashEvent(payload);
        break;
      default:
        this.logger.log(`Unhandled webhook event: ${gateway} - ${eventType}`);
    }
  }

  private async handleStripeEvent(eventType: string, payload: Record<string, unknown>): Promise<void> {
    const stripeObject = payload as { id?: string };

    if (eventType === 'checkout.session.completed' || eventType === 'payment_intent.succeeded') {
      const transaction = await this.transactionsService.findByExternalId(
        stripeObject.id || '',
        GatewayType.STRIPE,
      );
      if (transaction) {
        await this.transactionsService.updateStatus(
          transaction.id,
          TransactionStatus.COMPLETED,
          payload,
          'webhooks.stripe',
          { eventType },
        );
      }
    } else if (eventType === 'payment_intent.payment_failed') {
      const transaction = await this.transactionsService.findByExternalId(
        stripeObject.id || '',
        GatewayType.STRIPE,
      );
      if (transaction) {
        await this.transactionsService.updateStatus(
          transaction.id,
          TransactionStatus.FAILED,
          payload,
          'webhooks.stripe',
          { eventType },
        );
      }
    }
  }

  private async handlePayPalEvent(eventType: string, payload: Record<string, unknown>): Promise<void> {
    const resource = payload.resource as { id?: string; status?: string } | undefined;

    if (eventType === 'CHECKOUT.ORDER.APPROVED' || eventType === 'PAYMENT.CAPTURE.COMPLETED') {
      const transaction = await this.transactionsService.findByExternalId(
        resource?.id || '',
        GatewayType.PAYPAL,
      );
      if (transaction) {
        await this.transactionsService.updateStatus(
          transaction.id,
          TransactionStatus.COMPLETED,
          payload,
          'webhooks.paypal',
          { eventType },
        );
      }
    }
  }

  private async handleRazorpayEvent(eventType: string, payload: Record<string, unknown>): Promise<void> {
    const payloadObj = payload as {
      payload?: {
        payment?: { entity?: { id?: string } };
        order?: { entity?: { id?: string } };
      };
    };
    const payment = payloadObj?.payload?.payment?.entity;
    const order = payloadObj?.payload?.order?.entity;

    if (eventType === 'payment.captured' && payment) {
      const transaction = await this.transactionsService.findByExternalId(
        payment.id || order?.id || '',
        GatewayType.RAZORPAY,
      );
      if (transaction) {
        await this.transactionsService.updateStatus(
          transaction.id,
          TransactionStatus.COMPLETED,
          payload,
          'webhooks.razorpay',
          { eventType },
        );
      }
    }
  }

  private async handleBkashEvent(payload: Record<string, unknown>): Promise<void> {
    const paymentId = payload.payment_id as string | undefined;
    const status = payload.status as string | undefined;

    if (status === 'success' && paymentId) {
      const transaction = await this.transactionsService.findByExternalId(paymentId, GatewayType.BKASH);
      if (transaction) {
        await this.transactionsService.updateStatus(
          transaction.id,
          TransactionStatus.COMPLETED,
          payload,
          'webhooks.bkash',
          { eventType: 'payment.success' },
        );
      }
    }
  }

  async replayWebhook(
    eventId: string,
    reason?: string,
  ): Promise<{ success: boolean; message?: string; status?: WebhookProcessingStatus }> {
    const event = await this.webhookEventRepository.findOne({ where: { id: eventId } });

    if (!event) {
      return { success: false, message: 'Webhook event not found' };
    }

    if (event.signatureStatus === WebhookSignatureStatus.INVALID) {
      await this.recordReplayAttempt(event, event.status, event.status, reason, 'blocked', {
        message: 'Invalid signature events cannot be replayed',
      });
      return { success: false, message: 'Invalid signature events cannot be replayed' };
    }

    if (event.status === WebhookProcessingStatus.PROCESSING) {
      await this.recordReplayAttempt(event, event.status, event.status, reason, 'blocked', {
        message: 'Webhook event is already processing',
      });
      return { success: false, message: 'Webhook event is already processing', status: event.status };
    }

    const previousStatus = event.status;
    const replayReason = reason?.trim() || 'manual_admin_replay';

    try {
      await this.markEventProcessing(event);
      await this.processEvent(event.gateway, event.eventType, event.payload);
      event.replayCount += 1;
      event.lastReplayAt = new Date();
      event.lastReplayReason = replayReason;
      await this.markEventProcessed(event);

      await this.recordReplayAttempt(event, previousStatus, event.status, replayReason, 'processed');

      return { success: true, status: event.status };
    } catch (error) {
      event.replayCount += 1;
      event.lastReplayAt = new Date();
      event.lastReplayReason = replayReason;
      await this.markEventFailed(event, error);

      await this.recordReplayAttempt(event, previousStatus, event.status, replayReason, 'failed', {
        errorMessage: event.errorMessage,
      });

      return { success: false, message: event.errorMessage || 'Unknown error', status: event.status };
    }
  }

  async retryWebhook(eventId: string): Promise<{ success: boolean; message?: string }> {
    const event = await this.webhookEventRepository.findOne({ where: { id: eventId } });

    if (!event) {
      return { success: false, message: 'Webhook event not found' };
    }

    if (event.status === WebhookProcessingStatus.PROCESSED) {
      return { success: true, message: 'Event already processed' };
    }

    if (event.status === WebhookProcessingStatus.INVALID_SIGNATURE) {
      return { success: false, message: 'Invalid signature events cannot be retried' };
    }

    if (event.retryCount >= this.MAX_RETRIES) {
      return { success: false, message: 'Max retries exceeded' };
    }

    try {
      await this.markEventProcessing(event);
      await this.processEvent(event.gateway, event.eventType, event.payload);
      await this.markEventProcessed(event);
      return { success: true };
    } catch (error) {
      await this.markEventFailed(event, error);
      return { success: false, message: event.errorMessage || 'Unknown error' };
    }
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async processFailedWebhooks(): Promise<void> {
    const failedEvents = await this.webhookEventRepository.find({
      where: [
        {
          status: WebhookProcessingStatus.FAILED,
          nextRetryAt: LessThanOrEqual(new Date()),
        },
        {
          status: WebhookProcessingStatus.RECEIVED,
          nextRetryAt: IsNull(),
        },
      ],
      order: { createdAt: 'ASC' },
      take: 100,
    });

    for (const event of failedEvents) {
      if (event.retryCount < this.MAX_RETRIES) {
        await this.retryWebhook(event.id);
      }
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 20,
    filters: WebhookEventFilters = {},
  ): Promise<{
    data: WebhookEvent[];
    total: number;
    page: number;
    limit: number;
    summary: WebhookEventSummary;
  }> {
    const where = this.buildListFilters(filters);
    const [data, total, summary] = await Promise.all([
      this.webhookEventRepository.find({
        where,
        order: { createdAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.webhookEventRepository.count({ where }),
      this.getEventFeedSummary(where),
    ]);

    return { data, total, page, limit, summary };
  }

  async findOne(eventId: string): Promise<WebhookEvent | null> {
    return this.webhookEventRepository.findOne({ where: { id: eventId } });
  }

  async getBacklogSummary(): Promise<WebhookBacklogSummary> {
    const pendingStatuses = [
      WebhookProcessingStatus.RECEIVED,
      WebhookProcessingStatus.PROCESSING,
      WebhookProcessingStatus.FAILED,
    ];

    const [total, retryable, failed, processing, invalidSignature, oldestPendingEvent] =
      await Promise.all([
        this.webhookEventRepository.count({
          where: {
            status: In(pendingStatuses),
          },
        }),
        this.webhookEventRepository.count({
          where: {
            status: WebhookProcessingStatus.FAILED,
            nextRetryAt: LessThanOrEqual(new Date()),
          },
        }),
        this.webhookEventRepository.count({
          where: { status: WebhookProcessingStatus.FAILED },
        }),
        this.webhookEventRepository.count({
          where: { status: WebhookProcessingStatus.PROCESSING },
        }),
        this.webhookEventRepository.count({
          where: { status: WebhookProcessingStatus.INVALID_SIGNATURE },
        }),
        this.webhookEventRepository.findOne({
          where: {
            status: In(pendingStatuses),
          },
          order: { receivedAt: 'ASC' },
        }),
      ]);

    return {
      total,
      retryable,
      failed,
      processing,
      invalidSignature,
      oldestPendingAt: oldestPendingEvent?.receivedAt?.toISOString() || null,
    };
  }

  async getReliabilitySummary(): Promise<WebhookReliabilitySummary> {
    const backlog = await this.getBacklogSummary();
    const now = Date.now();
    const recentWindowStart = new Date(now - 24 * 60 * 60 * 1000);

    const [
      replayable,
      blockedReplay,
      maxRetriesExceeded,
      replayed,
      recentReceived,
      recentProcessed,
      recentFailed,
      recentInvalidSignature,
      lastReceivedEvent,
      lastProcessedEvent,
    ] = await Promise.all([
      this.webhookEventRepository.count({
        where: {
          signatureStatus: In([
            WebhookSignatureStatus.VALID,
            WebhookSignatureStatus.NOT_APPLICABLE,
            WebhookSignatureStatus.PENDING,
          ]),
          status: In(this.REPLAYABLE_STATUSES),
        },
      }),
      this.webhookEventRepository.count({
        where: {
          signatureStatus: WebhookSignatureStatus.INVALID,
        },
      }),
      this.webhookEventRepository.count({
        where: {
          status: WebhookProcessingStatus.FAILED,
          nextRetryAt: IsNull(),
        },
      }),
      this.webhookEventRepository.count({
        where: {
          replayCount: MoreThan(0),
        },
      }),
      this.webhookEventRepository.count({
        where: {
          receivedAt: MoreThan(recentWindowStart),
        },
      }),
      this.webhookEventRepository.count({
        where: {
          processedAt: MoreThan(recentWindowStart),
          status: WebhookProcessingStatus.PROCESSED,
        },
      }),
      this.webhookEventRepository.count({
        where: {
          updatedAt: MoreThan(recentWindowStart),
          status: WebhookProcessingStatus.FAILED,
        },
      }),
      this.webhookEventRepository.count({
        where: {
          updatedAt: MoreThan(recentWindowStart),
          status: WebhookProcessingStatus.INVALID_SIGNATURE,
        },
      }),
      this.webhookEventRepository.findOne({
        order: { receivedAt: 'DESC' },
      }),
      this.webhookEventRepository.findOne({
        where: { status: WebhookProcessingStatus.PROCESSED },
        order: { processedAt: 'DESC' },
      }),
    ]);

    const backlogAgeSeconds = backlog.oldestPendingAt
      ? Math.max(0, Math.round((now - new Date(backlog.oldestPendingAt).getTime()) / 1000))
      : null;

    return {
      status: this.resolveReliabilityStatus(backlog),
      replayable,
      blockedReplay,
      maxRetriesExceeded,
      lastReceivedAt: lastReceivedEvent?.receivedAt?.toISOString() || null,
      lastProcessedAt: lastProcessedEvent?.processedAt?.toISOString() || null,
      backlogAgeSeconds,
      recent24h: {
        received: recentReceived,
        processed: recentProcessed,
        failed: recentFailed,
        invalidSignature: recentInvalidSignature,
        replayed,
      },
    };
  }

  private normalizeHeaders(
    headers: Record<string, string | string[] | undefined>,
  ): Record<string, string> {
    return Object.entries(headers).reduce<Record<string, string>>((acc, [key, value]) => {
      if (typeof value === 'undefined') {
        return acc;
      }

      acc[key] = Array.isArray(value) ? value.join(', ') : String(value);
      return acc;
    }, {});
  }

  private parsePayload(payload: string | Record<string, unknown>): Record<string, unknown> {
    if (typeof payload !== 'string') {
      return payload;
    }

    try {
      return JSON.parse(payload) as Record<string, unknown>;
    } catch {
      return { raw: payload };
    }
  }

  private buildNormalizedEventKey(
    gateway: GatewayType,
    eventId?: string,
    eventType?: string,
    payload?: unknown,
  ): string {
    if (eventId) {
      return `${gateway}:${eventId}`;
    }

    return `${gateway}:${eventType || 'unknown'}:${CryptoUtil.hashData(
      JSON.stringify(payload || {}),
    )}`;
  }

  private resolveSignatureStatus(
    gateway: GatewayType,
    valid: boolean,
  ): WebhookSignatureStatus {
    const gatewaysWithExplicitSignatureCheck = new Set<GatewayType>([
      GatewayType.STRIPE,
      GatewayType.RAZORPAY,
      GatewayType.PAYPAL,
      GatewayType.BKASH,
      GatewayType.NAGAD,
    ]);

    if (!gatewaysWithExplicitSignatureCheck.has(gateway)) {
      return WebhookSignatureStatus.NOT_APPLICABLE;
    }

    return valid ? WebhookSignatureStatus.VALID : WebhookSignatureStatus.INVALID;
  }

  private buildListFilters(filters: WebhookEventFilters): FindOptionsWhere<WebhookEvent> {
    const where: FindOptionsWhere<WebhookEvent> = {};

    if (filters.gateway) {
      where.gateway = filters.gateway;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.signatureStatus) {
      where.signatureStatus = filters.signatureStatus;
    }

    if (typeof filters.replayable === 'boolean') {
      where.signatureStatus = filters.replayable
        ? In([
            WebhookSignatureStatus.VALID,
            WebhookSignatureStatus.NOT_APPLICABLE,
            WebhookSignatureStatus.PENDING,
          ])
        : WebhookSignatureStatus.INVALID;
      where.status = filters.replayable
        ? In(this.REPLAYABLE_STATUSES)
        : WebhookProcessingStatus.INVALID_SIGNATURE;
    }

    return where;
  }

  private async getEventFeedSummary(
    where: FindOptionsWhere<WebhookEvent>,
  ): Promise<WebhookEventSummary> {
    const events = await this.webhookEventRepository.find({
      where,
      select: {
        gateway: true,
        status: true,
        signatureStatus: true,
      },
    });

    return events.reduce<WebhookEventSummary>(
      (summary, event) => {
        summary.total += 1;
        summary.byGateway[event.gateway] = (summary.byGateway[event.gateway] || 0) + 1;
        summary.byStatus[event.status] = (summary.byStatus[event.status] || 0) + 1;
        summary.bySignatureStatus[event.signatureStatus] =
          (summary.bySignatureStatus[event.signatureStatus] || 0) + 1;

        if (event.status === WebhookProcessingStatus.FAILED) {
          summary.retryable += 1;
        }

        if (
          event.signatureStatus !== WebhookSignatureStatus.INVALID &&
          this.REPLAYABLE_STATUSES.includes(event.status)
        ) {
          summary.replayable += 1;
        }

        return summary;
      },
      {
        total: 0,
        replayable: 0,
        retryable: 0,
        byGateway: {},
        byStatus: {},
        bySignatureStatus: {},
      },
    );
  }

  private resolveReliabilityStatus(
    backlog: WebhookBacklogSummary,
  ): WebhookReliabilitySummary['status'] {
    if (backlog.invalidSignature > 0 || backlog.failed > 3) {
      return 'attention';
    }

    if (backlog.total > 0 || backlog.processing > 0 || backlog.retryable > 0) {
      return 'active';
    }

    return 'healthy';
  }

  private async markEventProcessing(event: WebhookEvent): Promise<void> {
    event.status = WebhookProcessingStatus.PROCESSING;
    event.processingStartedAt = new Date();
    event.nextRetryAt = null;
    await this.webhookEventRepository.save(event);
  }

  private async markEventProcessed(event: WebhookEvent): Promise<void> {
    const now = new Date();
    event.status = WebhookProcessingStatus.PROCESSED;
    event.processingStartedAt = null;
    event.processedAt = now;
    event.firstProcessedAt = event.firstProcessedAt || now;
    event.errorMessage = null;
    event.nextRetryAt = null;
    await this.webhookEventRepository.save(event);
  }

  private async markEventFailed(event: WebhookEvent, error: unknown): Promise<void> {
    event.retryCount += 1;
    event.status = WebhookProcessingStatus.FAILED;
    event.processingStartedAt = null;
    event.errorMessage = error instanceof Error ? error.message : 'Unknown error';
    event.nextRetryAt =
      event.retryCount < this.MAX_RETRIES
        ? new Date(Date.now() + RetryUtil.calculateBackoff(event.retryCount))
        : null;
    await this.webhookEventRepository.save(event);
  }

  private async recordReplayAttempt(
    event: WebhookEvent,
    previousStatus: WebhookProcessingStatus,
    nextStatus: WebhookProcessingStatus,
    reason: string | undefined,
    outcome: 'processed' | 'failed' | 'blocked',
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    await this.auditService.recordEntry({
      entityType: AuditEntityType.WEBHOOK_EVENT,
      entityId: event.id,
      webhookEventId: event.id,
      gateway: event.gateway,
      action: AuditActionType.WEBHOOK_REPLAY_ATTEMPTED,
      previousStatus,
      nextStatus,
      source: 'webhooks.replayWebhook',
      metadata: {
        eventId: event.eventId,
        eventType: event.eventType,
        replayReason: reason?.trim() || 'manual_admin_replay',
        outcome,
        replayCount: event.replayCount,
        ...(metadata || {}),
      },
    });
  }
}
