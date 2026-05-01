import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { ConfigService } from '@nestjs/config';
import { Role } from '../roles.enum';
import { getValidatedAuthPasswords } from '../auth-env.validation';

interface ValidatedUser {
  id: string;
  username: string;
  role: Role;
}

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly validUsers: Record<string, { password: string; role: Role; id: string }>;

  constructor(private readonly configService: ConfigService) {
    super({ usernameField: 'username' });

    const passwords = getValidatedAuthPasswords(this.configService);
    this.validUsers = {
      admin: { password: passwords.admin, role: Role.ADMIN, id: '1' },
      operator: { password: passwords.operator, role: Role.OPERATOR, id: '2' },
      viewer: { password: passwords.viewer, role: Role.VIEWER, id: '3' },
    };
  }

  validate(username: string, password: string): ValidatedUser {
    const user = this.validUsers[username];
    if (!user || user.password !== password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return { id: user.id, username, role: user.role };
  }
}
