import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { createRefreshToken, hashToken } from './token';

const accessTtlSeconds = 15 * 60;
const refreshTtlMs = 30 * 24 * 60 * 60 * 1000;

type AdminIdentity = {
  id: string;
  login: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login(login: string, password: string) {
    const user = await this.prisma.adminUser.findUnique({ where: { login } });
    const matches = user
      ? await bcrypt.compare(password, user.passwordHash)
      : false;
    if (!user || !matches) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    return this.issue(user);
  }

  async refresh(refreshToken: string) {
    const stored = await this.prisma.refreshToken.findUnique({
      where: { tokenHash: hashToken(refreshToken) },
      include: { user: true },
    });

    if (!stored || stored.expiresAt.getTime() <= Date.now()) {
      if (stored) {
        await this.prisma.refreshToken.delete({ where: { id: stored.id } });
      }
      throw new UnauthorizedException('Refresh-токен недействителен');
    }

    await this.prisma.refreshToken.delete({ where: { id: stored.id } });
    return this.issue(stored.user);
  }

  async logout(refreshToken: string) {
    await this.prisma.refreshToken.deleteMany({
      where: { tokenHash: hashToken(refreshToken) },
    });
  }

  private async issue(user: AdminIdentity) {
    const accessToken = await this.jwt.signAsync(
      { sub: user.id, login: user.login },
      { expiresIn: accessTtlSeconds },
    );
    const refreshToken = createRefreshToken();

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(refreshToken),
        expiresAt: new Date(Date.now() + refreshTtlMs),
      },
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: accessTtlSeconds,
    };
  }
}
