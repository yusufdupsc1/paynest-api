import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from './roles.enum';

interface User {
  id: string;
  username: string;
  role: Role;
}

export interface TokenResponse {
  accessToken: string;
  user: {
    id: string;
    username: string;
    role: Role;
  };
}

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  login(user: User): TokenResponse {
    const payload = { sub: user.id, username: user.username, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }

  validateToken(token: string): { sub: string; username: string; role: string } | null {
    try {
      return this.jwtService.verify(token) as { sub: string; username: string; role: string };
    } catch {
      return null;
    }
  }
}
