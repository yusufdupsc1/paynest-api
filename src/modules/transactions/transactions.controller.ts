import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpCode,
  NotFoundException,
  BadRequestException,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiHeader, ApiBearerAuth } from '@nestjs/swagger';
import { TransactionsService, CreatePaymentDto, TransactionFilters } from './transactions.service';
import { Transaction } from './entities/transaction.entity';
import { GatewayType, TransactionStatus } from '../../common/types';

@ApiTags('transactions')
@ApiBearerAuth()
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('initiate')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Initiate a new payment' })
  @ApiHeader({ name: 'idempotency-key', required: true, description: 'Unique idempotency key' })
  @ApiResponse({ status: 201, description: 'Payment initiated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  async initiatePayment(
    @Body() dto: CreatePaymentDto,
    @Headers('idempotency-key') idempotencyKey: string,
  ): Promise<{ success: boolean; transaction: Transaction; paymentUrl?: string }> {
    if (!idempotencyKey) {
      throw new BadRequestException('idempotency-key header is required');
    }

    dto.idempotencyKey = idempotencyKey;
    const transaction = await this.transactionsService.createPayment(dto);

    return {
      success: transaction.status !== TransactionStatus.FAILED,
      transaction,
      paymentUrl: transaction.paymentUrl ?? undefined,
    };
  }

  @Get()
  @ApiOperation({ summary: 'List all transactions' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'gateway', required: false, enum: GatewayType })
  @ApiQuery({ name: 'status', required: false, enum: TransactionStatus })
  @ApiQuery({ name: 'customerEmail', required: false })
  async listTransactions(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('gateway') gateway?: GatewayType,
    @Query('status') status?: TransactionStatus,
    @Query('customerEmail') customerEmail?: string,
  ): Promise<{ data: Transaction[]; total: number; page: number; limit: number }> {
    const filters: TransactionFilters = { gateway, status, customerEmail };
    return this.transactionsService.findAll(filters, page || 1, limit || 20);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get transaction by ID' })
  @ApiResponse({ status: 200, description: 'Transaction details' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async getTransaction(@Param('id') id: string): Promise<Transaction> {
    const transaction = await this.transactionsService.findOne(id);
    if (!transaction) {
      throw new NotFoundException(`Transaction ${id} not found`);
    }
    return transaction;
  }

  @Get('stats/summary')
  @ApiOperation({ summary: 'Get transaction statistics' })
  async getStats(): Promise<{
    totalTransactions: number;
    totalAmount: number;
    totalRefunded: number;
    byGateway: Record<string, { count: number; amount: number }>;
  }> {
    return this.transactionsService.getTransactionStats();
  }
}
