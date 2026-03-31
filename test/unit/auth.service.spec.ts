import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../../src/modules/auth/auth.service';
import { Role } from '../../src/modules/auth/roles.enum';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(() => {
    jwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    service = new AuthService(jwtService);
  });

  describe('login', () => {
    it('returns access token and user info on successful login', () => {
      jwtService.sign.mockReturnValue('test-jwt-token');

      const user = { id: '1', username: 'admin', role: Role.ADMIN };
      const result = service.login(user);

      expect(result).toEqual({
        accessToken: 'test-jwt-token',
        user: {
          id: '1',
          username: 'admin',
          role: Role.ADMIN,
        },
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: '1',
        username: 'admin',
        role: Role.ADMIN,
      });
    });

    it('includes correct payload for operator role', () => {
      jwtService.sign.mockReturnValue('operator-token');

      const user = { id: '2', username: 'operator', role: Role.OPERATOR };
      const result = service.login(user);

      expect(result.user.role).toBe(Role.OPERATOR);
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: '2',
        username: 'operator',
        role: Role.OPERATOR,
      });
    });

    it('includes correct payload for viewer role', () => {
      jwtService.sign.mockReturnValue('viewer-token');

      const user = { id: '3', username: 'viewer', role: Role.VIEWER };
      const result = service.login(user);

      expect(result.user.role).toBe(Role.VIEWER);
    });
  });

  describe('validateToken', () => {
    it('returns decoded payload for valid token', () => {
      const payload = { sub: '1', username: 'admin', role: 'admin' };
      jwtService.verify.mockReturnValue(payload);

      const result = service.validateToken('valid-token');

      expect(result).toEqual(payload);
      expect(jwtService.verify).toHaveBeenCalledWith('valid-token');
    });

    it('returns null for invalid token', () => {
      jwtService.verify.mockImplementation(() => {
        throw new Error('jwt malformed');
      });

      const result = service.validateToken('invalid-token');

      expect(result).toBeNull();
    });

    it('returns null for expired token', () => {
      jwtService.verify.mockImplementation(() => {
        throw new Error('jwt expired');
      });

      const result = service.validateToken('expired-token');

      expect(result).toBeNull();
    });
  });
});
