import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

export type AccessPayload = {
  sub: string;
  login: string;
};

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: AccessPayload }>();
    const header = request.header('authorization');
    const token = header?.startsWith('Bearer ')
      ? header.slice('Bearer '.length)
      : undefined;

    if (!token) {
      throw new UnauthorizedException('Нужен Bearer access-токен');
    }

    try {
      request.user = await this.jwt.verifyAsync<AccessPayload>(token);
      return true;
    } catch {
      throw new UnauthorizedException('Access-токен недействителен');
    }
  }
}
