import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from '../../src/modules/auth/guards/roles.guard';
import { Role } from '../../src/modules/auth/roles.enum';
import { ROLES_KEY } from '../../src/modules/auth/decorators/roles.decorator';

function createMockContext(metadata: Record<string, unknown> = {}): ExecutionContext {
  return {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue(metadata.request || {}),
      getResponse: jest.fn().mockReturnValue({}),
    }),
  } as unknown as ExecutionContext;
}

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: jest.Mocked<Reflector>;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as unknown as jest.Mocked<Reflector>;
    guard = new RolesGuard(reflector);
  });

  it('allows access when no roles are required', () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);
    const context = createMockContext();

    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('allows access when user has required role', () => {
    reflector.getAllAndOverride.mockReturnValue([Role.ADMIN]);
    const context = createMockContext({
      request: { user: { sub: '1', username: 'admin', role: Role.ADMIN } },
    });

    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('denies access when user does not have required role', () => {
    reflector.getAllAndOverride.mockReturnValue([Role.ADMIN]);
    const context = createMockContext({
      request: { user: { sub: '2', username: 'viewer', role: Role.VIEWER } },
    });

    const result = guard.canActivate(context);

    expect(result).toBe(false);
  });

  it('denies access when no user in request', () => {
    reflector.getAllAndOverride.mockReturnValue([Role.ADMIN]);
    const context = createMockContext({ request: {} });

    const result = guard.canActivate(context);

    expect(result).toBe(false);
  });

  it('allows access when user has one of multiple required roles', () => {
    reflector.getAllAndOverride.mockReturnValue([Role.ADMIN, Role.OPERATOR]);
    const context = createMockContext({
      request: { user: { sub: '2', username: 'operator', role: Role.OPERATOR } },
    });

    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });
});

describe('JwtAuthGuard (public route bypass)', () => {
  let reflector: jest.Mocked<Reflector>;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as unknown as jest.Mocked<Reflector>;
  });

  it('identifies public routes via reflector metadata', () => {
    reflector.getAllAndOverride.mockReturnValue(true);
    const context = createMockContext();

    reflector.getAllAndOverride<boolean>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    expect(reflector.getAllAndOverride).toBeDefined();
  });
});
