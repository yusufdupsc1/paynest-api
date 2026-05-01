import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Query,
  Headers,
  Req,
  HttpCode,
  HttpStatus,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Request } from 'express';
import { WebhooksService } from './webhooks.service';
import {
  GatewayType,
  ReplayWebhookDto,
  WebhookProcessingStatus,
  WebhookSignatureStatus,
} from '../../common/types';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/roles.enum';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Public()
  @Post('stripe')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle Stripe webhooks' })
  @ApiHeader({ name: 'stripe-signature', required: true })
  @ApiResponse({ status: 200, description: 'Webhook processed' })
  async handleStripeWebhook(
    @Body() body: string | Record<string, unknown>,
    @Headers('stripe-signature') signature: string,
    @Req() request: Request,
  ): Promise<{ received: boolean }> {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }
    const rawBody = typeof body === 'string' ? body : JSON.stringify(body);
    const result = await this.webhooksService.processWebhook({
      gateway: GatewayType.STRIPE,
      payload: rawBody,
      headers: request.headers as Record<string, string | string[] | undefined>,
    });
    return { received: result.success };
  }

  @Public()
  @Post('paypal')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle PayPal webhooks' })
  @ApiResponse({ status: 200, description: 'Webhook processed' })
  async handlePayPalWebhook(
    @Body() body: Record<string, unknown>,
    @Req() request: Request,
  ): Promise<{ received: boolean }> {
    const result = await this.webhooksService.processWebhook({
      gateway: GatewayType.PAYPAL,
      payload: body,
      headers: request.headers as Record<string, string | string[] | undefined>,
    });
    return { received: result.success };
  }

  @Public()
  @Post('razorpay')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle Razorpay webhooks' })
  @ApiHeader({ name: 'x-razorpay-signature', required: true })
  @ApiResponse({ status: 200, description: 'Webhook processed' })
  async handleRazorpayWebhook(
    @Body() body: Record<string, unknown>,
    @Headers('x-razorpay-signature') signature: string,
    @Req() request: Request,
  ): Promise<{ received: boolean }> {
    if (!signature) {
      throw new BadRequestException('Missing x-razorpay-signature header');
    }
    const result = await this.webhooksService.processWebhook({
      gateway: GatewayType.RAZORPAY,
      payload: body,
      headers: request.headers as Record<string, string | string[] | undefined>,
    });
    return { received: result.success };
  }

  @Public()
  @Post('bkash')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle bKash webhooks' })
  @ApiResponse({ status: 200, description: 'Webhook processed' })
  async handleBkashWebhook(
    @Body() body: Record<string, unknown>,
    @Req() request: Request,
  ): Promise<{ received: boolean }> {
    const result = await this.webhooksService.processWebhook({
      gateway: GatewayType.BKASH,
      payload: body,
      headers: request.headers as Record<string, string | string[] | undefined>,
    });
    return { received: result.success };
  }

  @Public()
  @Post('nagad')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle Nagad webhooks' })
  @ApiResponse({ status: 200, description: 'Webhook processed' })
  async handleNagadWebhook(
    @Body() body: Record<string, unknown>,
    @Req() request: Request,
  ): Promise<{ received: boolean }> {
    const result = await this.webhooksService.processWebhook({
      gateway: GatewayType.NAGAD,
      payload: body,
      headers: request.headers as Record<string, string | string[] | undefined>,
    });
    return { received: result.success };
  }

  @Roles(Role.ADMIN, Role.OPERATOR)
  @Post('admin/:id/replay')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Replay a stored webhook event' })
  @ApiParam({ name: 'id', description: 'Webhook event ID' })
  @ApiResponse({ status: 200, description: 'Replay result' })
  async replayWebhook(
    @Param('id') id: string,
    @Body() body: ReplayWebhookDto,
  ): Promise<{ success: boolean; message?: string; status?: WebhookProcessingStatus }> {
    return this.webhooksService.replayWebhook(id, body?.reason);
  }

  @Public()
  @Post(':gateway')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle generic gateway webhook' })
  @ApiParam({ name: 'gateway', enum: GatewayType })
  @ApiResponse({ status: 200, description: 'Webhook processed' })
  async handleGenericWebhook(
    @Param('gateway') gateway: GatewayType,
    @Body() body: Record<string, unknown>,
    @Req() request: Request,
  ): Promise<{ received: boolean }> {
    const safeGenericGateways: GatewayType[] = [];
    if (!safeGenericGateways.includes(gateway)) {
      throw new BadRequestException(
        `Generic webhook route is not enabled for ${gateway}. Use the provider-specific webhook endpoint.`,
      );
    }

    const result = await this.webhooksService.processWebhook({
      gateway,
      payload: body,
      headers: request.headers as Record<string, string | string[] | undefined>,
    });
    return { received: result.success };
  }

  @Roles(Role.ADMIN, Role.OPERATOR)
  @Get()
  @ApiOperation({ summary: 'List webhook events' })
  @ApiResponse({ status: 200, description: 'List of webhook events' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'gateway', required: false, enum: GatewayType })
  @ApiQuery({ name: 'status', required: false, enum: WebhookProcessingStatus })
  @ApiQuery({ name: 'signatureStatus', required: false, enum: WebhookSignatureStatus })
  @ApiQuery({ name: 'replayable', required: false, type: Boolean })
  async listWebhooks(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('gateway') gateway?: GatewayType,
    @Query('status') status?: WebhookProcessingStatus,
    @Query('signatureStatus') signatureStatus?: WebhookSignatureStatus,
    @Query('replayable') replayable?: boolean,
  ): Promise<{ data: unknown[]; total: number; page: number; limit: number; summary: unknown }> {
    return this.webhooksService.findAll(page || 1, limit || 20, {
      gateway,
      status,
      signatureStatus,
      replayable,
    });
  }

  @Roles(Role.ADMIN, Role.OPERATOR)
  @Get(':id')
  @ApiOperation({ summary: 'Get stored webhook event details' })
  @ApiParam({ name: 'id', description: 'Webhook event ID' })
  @ApiResponse({ status: 200, description: 'Webhook event details' })
  @ApiResponse({ status: 404, description: 'Webhook event not found' })
  async getWebhook(@Param('id') id: string): Promise<unknown> {
    const event = await this.webhooksService.findOne(id);

    if (!event) {
      throw new NotFoundException(`Webhook event ${id} not found`);
    }

    return event;
  }

  @Roles(Role.ADMIN, Role.OPERATOR)
  @Post('retry/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retry a failed webhook' })
  @ApiParam({ name: 'id', description: 'Webhook event ID' })
  @ApiResponse({ status: 200, description: 'Retry result' })
  async retryWebhook(
    @Param('id') id: string,
  ): Promise<{ success: boolean; message?: string }> {
    return this.webhooksService.retryWebhook(id);
  }
}
