export interface MockRepository<T extends object> {
  create: jest.Mock<T, [Partial<T>?]>;
  save: jest.Mock<Promise<T>, [T]>;
  findOne: jest.Mock<Promise<T | null>, [unknown]>;
  find: jest.Mock<Promise<T[]>, [unknown?]>;
  findAndCount: jest.Mock<Promise<[T[], number]>, [unknown?]>;
  count: jest.Mock<Promise<number>, [unknown?]>;
  increment: jest.Mock<Promise<void>, [unknown, string, number]>;
}

export function createMockRepository<T extends object>(): MockRepository<T> {
  return {
    create: jest.fn((entity?: Partial<T>) => ({ ...(entity || {}) }) as T),
    save: jest.fn(async (entity: T) => entity),
    findOne: jest.fn(async (_options: unknown) => null),
    find: jest.fn(async (_options?: unknown) => []),
    findAndCount: jest.fn(async (_options?: unknown) => [[], 0] as [T[], number]),
    count: jest.fn(async (_options?: unknown) => 0),
    increment: jest.fn(async (_criteria: unknown, _property: string, _value: number) => undefined),
  };
}

export function resetMockRepository<T extends object>(
  repository: MockRepository<T>,
): void {
  Object.values(repository).forEach((mockFn) => mockFn.mockReset());
}
