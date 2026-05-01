import { BadRequestException } from '@nestjs/common';
import { GatewayType } from '../../src/common/types';
import { WebhooksService } from '../../src/modules/webhooks/webhooks.service';
import { WebhooksController } from '../../src/modules/webhooks/webhooks.controller';

describe('WebhooksController', () => {
  it('keeps the generic webhook route fail-closed', async () => {
    const webhooksService = {
      processWebhook: jest.fn(),
    } as unknown as WebhooksService;
    const controller = new WebhooksController(webhooksService);

    await expect(
      controller.handleGenericWebhook(
        GatewayType.BKASH,
        { id: 'evt-1' },
        { headers: {} } as never,
      ),
    ).rejects.toThrow(BadRequestException);
    expect(webhooksService.processWebhook).not.toHaveBeenCalled();
  });
});
