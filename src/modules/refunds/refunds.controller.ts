import { Controller, Post, Body, Param, Get, Query, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { RefundsService, CreateRefundDto } from './refunds.service';
import { Refund } from './entities/refund.entity';

@ApiTags('refunds')
@Controller('refunds')
export class RefundsController {
  constructor(private readonly refundsService: RefundsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a refund' })
  @ApiResponse({ status: 201, description: 'Refund created' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async createRefund(@Body() dto: CreateRefundDto): Promise<{ success: boolean; refund: Refund }> {
    const refund = await this.refundsService.createRefund(dto);
    return { success: refund.status !== 'failed', refund };
  }

  @Get()
  @ApiOperation({ summary: 'List all refunds' })
  @ApiResponse({ status: 200, description: 'List of refunds' })
  async listRefunds(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<{ data: Refund[]; total: number; page: number; limit: number }> {
    return this.refundsService.findAll(page || 1, limit || 20);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get refund statistics' })
  @ApiResponse({ status: 200, description: 'Refund statistics' })
  async getRefundStats(): Promise<{
    totalRefunds: number;
    totalAmount: number;
    pendingRefunds: number;
    byGateway: Record<string, { count: number; amount: number }>;
  }> {
    return this.refundsService.getRefundStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get refund by ID' })
  @ApiParam({ name: 'id', description: 'Refund ID' })
  @ApiResponse({ status: 200, description: 'Refund details' })
  @ApiResponse({ status: 404, description: 'Refund not found' })
  async getRefund(@Param('id') id: string): Promise<Refund> {
    const refund = await this.refundsService.findOne(id);
    if (!refund) {
      throw new NotFoundException(`Refund ${id} not found`);
    }
    return refund;
  }
}
