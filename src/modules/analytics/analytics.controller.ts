import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AnalyticsService } from "./analytics.service";

const DATE_ONLY_QUERY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DATE_PREFIX_QUERY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})(?:$|[T\s])/;

function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function getDaysInMonth(year: number, month: number): number {
  return (
    [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][
      month - 1
    ] || 0
  );
}

function assertCalendarDateExists(
  value: string,
  boundary: "start" | "end",
): void {
  const datePrefixMatch = value.match(DATE_PREFIX_QUERY_PATTERN);

  if (!datePrefixMatch) {
    return;
  }

  const [, yearString, monthString, dayString] = datePrefixMatch;
  const year = Number.parseInt(yearString, 10);
  const month = Number.parseInt(monthString, 10);
  const day = Number.parseInt(dayString, 10);

  if (month < 1 || month > 12 || day < 1 || day > getDaysInMonth(year, month)) {
    throw new BadRequestException(`Invalid ${boundary}Date query parameter`);
  }
}

function parseAnalyticsDateQuery(
  value: string | undefined,
  boundary: "start" | "end",
): Date | undefined {
  if (!value) {
    return undefined;
  }

  const normalizedValue = value.trim();

  assertCalendarDateExists(normalizedValue, boundary);

  if (DATE_ONLY_QUERY_PATTERN.test(normalizedValue)) {
    const parsedDate = new Date(
      boundary === "start"
        ? `${normalizedValue}T00:00:00.000Z`
        : `${normalizedValue}T23:59:59.999Z`,
    );

    if (
      Number.isNaN(parsedDate.getTime()) ||
      parsedDate.toISOString().slice(0, 10) !== normalizedValue
    ) {
      throw new BadRequestException(`Invalid ${boundary}Date query parameter`);
    }

    return parsedDate;
  }

  const parsedDate = new Date(normalizedValue);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new BadRequestException(`Invalid ${boundary}Date query parameter`);
  }

  return parsedDate;
}

@ApiTags("analytics")
@Controller("analytics")
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get("summary")
  @ApiOperation({ summary: "Get dashboard summary" })
  @ApiQuery({ name: "startDate", required: false })
  @ApiQuery({ name: "endDate", required: false })
  @ApiResponse({ status: 200, description: "Dashboard summary" })
  @ApiResponse({ status: 400, description: "Invalid date query" })
  async getSummary(
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
  ): Promise<{
    totalTransactions: number;
    totalAmount: number;
    totalRefunds: number;
    netAmount: number;
    successRate: number;
    byGateway: Record<string, { count: number; amount: number }>;
    byStatus: Record<string, number>;
  }> {
    const start = parseAnalyticsDateQuery(startDate, "start");
    const end = parseAnalyticsDateQuery(endDate, "end");
    return this.analyticsService.getSummary(start, end);
  }

  @Get("by-gateway")
  @ApiOperation({ summary: "Get analytics by gateway" })
  @ApiQuery({ name: "startDate", required: false })
  @ApiQuery({ name: "endDate", required: false })
  @ApiResponse({ status: 200, description: "Gateway analytics" })
  @ApiResponse({ status: 400, description: "Invalid date query" })
  async getByGateway(
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
  ): Promise<
    {
      gateway: string;
      totalTransactions: number;
      totalAmount: number;
      totalRefunds: number;
      netAmount: number;
    }[]
  > {
    const start = parseAnalyticsDateQuery(startDate, "start");
    const end = parseAnalyticsDateQuery(endDate, "end");
    return this.analyticsService.getByGateway(start, end);
  }

  @Get("trends")
  @ApiOperation({ summary: "Get transaction trends" })
  @ApiQuery({ name: "days", required: false, type: Number })
  @ApiResponse({ status: 200, description: "Trends data" })
  async getTrends(@Query("days") days?: number): Promise<
    {
      date: string;
      transactions: number;
      amount: number;
      refunds: number;
    }[]
  > {
    return this.analyticsService.getTrends(days || 30);
  }

  @Get("refunds")
  @ApiOperation({ summary: "Get refund analytics" })
  @ApiResponse({ status: 200, description: "Refund analytics" })
  async getRefundAnalytics(): Promise<{
    totalRefunds: number;
    totalAmount: number;
    pendingRefunds: number;
    byGateway: Record<string, { count: number; amount: number }>;
  }> {
    return this.analyticsService.getRefundAnalytics();
  }
}
