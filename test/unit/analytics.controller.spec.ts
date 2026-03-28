import { BadRequestException } from "@nestjs/common";
import { AnalyticsController } from "../../src/modules/analytics/analytics.controller";

describe("AnalyticsController", () => {
  it("normalizes date-only end dates to the end of the day", async () => {
    const analyticsService = {
      getSummary: jest.fn().mockResolvedValue({}),
      getByGateway: jest.fn().mockResolvedValue([]),
    };

    const controller = new AnalyticsController(analyticsService as never);

    await controller.getSummary("2026-03-01", "2026-03-31");

    expect(analyticsService.getSummary).toHaveBeenCalledWith(
      new Date("2026-03-01T00:00:00.000Z"),
      new Date("2026-03-31T23:59:59.999Z"),
    );
  });

  it("rejects invalid date query values", async () => {
    const analyticsService = {
      getSummary: jest.fn(),
      getByGateway: jest.fn(),
    };

    const controller = new AnalyticsController(analyticsService as never);

    await expect(
      controller.getByGateway("not-a-date", "2026-03-31"),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(analyticsService.getByGateway).not.toHaveBeenCalled();
  });

  it("rejects impossible date-only query values", async () => {
    const analyticsService = {
      getSummary: jest.fn(),
      getByGateway: jest.fn(),
    };

    const controller = new AnalyticsController(analyticsService as never);

    await expect(
      controller.getSummary("2026-02-31", "2026-03-31"),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(analyticsService.getSummary).not.toHaveBeenCalled();
  });

  it("rejects impossible timestamp query values", async () => {
    const analyticsService = {
      getSummary: jest.fn(),
      getByGateway: jest.fn(),
    };

    const controller = new AnalyticsController(analyticsService as never);

    await expect(
      controller.getSummary("2026-02-31T00:00:00.000Z", "2026-03-31T23:59:59.999Z"),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(analyticsService.getSummary).not.toHaveBeenCalled();
  });
});
