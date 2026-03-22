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
    findOne: jest.fn(async () => null),
    find: jest.fn(async () => []),
    findAndCount: jest.fn(async () => [[], 0]),
    count: jest.fn(async () => 0),
    increment: jest.fn(async () => undefined),
  };
}

export function resetMockRepository<T extends object>(
  repository: MockRepository<T>,
): void {
  Object.values(repository).forEach((mockFn) => mockFn.mockReset());
}
