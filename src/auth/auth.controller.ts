import {
  Body,
  Controller,
  Res,
  Get,
  Post,
  UseGuards,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { Request, Response } from 'express';
import { CurrentUser } from 'src/utils/decorators/current-user.decorator';
import { GoogleGuard } from './guards/google.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { LocalGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.register(dto, res);
  }

  @UseGuards(LocalGuard)
  @Post('login')
  async login(
    @CurrentUser('id', ParseIntPipe) userId: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.generateTokens(userId, res);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(
    @CurrentUser('id', ParseIntPipe) userId: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.generateTokens(userId, res);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('refresh_token', '');
  }

  @UseGuards(GoogleGuard)
  @Get('google')
  google() {}

  @UseGuards(GoogleGuard)
  @Get('google/callback')
  async googleCallback(
    @Req() req: Request & { user: { _json: { email: string } } },
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.googleAuth(req.user._json.email, res);
  }
}
