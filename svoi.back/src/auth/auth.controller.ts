import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import type { z } from 'zod';
import { ZodPipe } from '../common/zod.pipe';
import { loginSchema, refreshSchema } from './auth.schema';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  @HttpCode(200)
  login(@Body(new ZodPipe(loginSchema)) body: z.infer<typeof loginSchema>) {
    return this.auth.login(body.login, body.password);
  }

  @Post('refresh')
  @HttpCode(200)
  refresh(
    @Body(new ZodPipe(refreshSchema)) body: z.infer<typeof refreshSchema>,
  ) {
    return this.auth.refresh(body.refreshToken);
  }

  @Post('logout')
  @HttpCode(204)
  async logout(
    @Body(new ZodPipe(refreshSchema)) body: z.infer<typeof refreshSchema>,
  ) {
    await this.auth.logout(body.refreshToken);
  }
}
