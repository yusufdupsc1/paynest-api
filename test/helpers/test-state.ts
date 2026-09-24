import { IdempotencyService } from '../../src/modules/transactions/idempotency.service';

export async function clearIdempotencyState(service: IdempotencyService, keys: string[]): Promise<void> {
  await Promise.all(keys.map((key) => service.removeMapping(key)));
}

export async function flushPromises(): Promise<void> {
  await new Promise((resolve) => setImmediate(resolve));
}
