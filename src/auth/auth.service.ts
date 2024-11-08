import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { UsersService } from 'src/users/users.service';
import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register({ email, password }: RegisterDto, res: Response) {
    const hashedPassword = await hash(password);

    const createdUser = await this.usersService.createOne({
      email,
      hashedPassword,
    });

    return await this.generateTokens(createdUser.id, res);
  }

  async validateUser(email: string, password: string) {
    const existingUser = await this.usersService.getOne({ email });

    if (!existingUser) {
      return null;
    }
    if (!existingUser.hashedPassword) {
      throw new BadRequestException(
        'Probably you already have an account via google',
      );
    }
    const isValidPw = await verify(existingUser.hashedPassword, password);

    if (!isValidPw) {
      return null;
    }

    return existingUser;
  }

  async googleAuth(email: string, res: Response) {
    const existingUser = await this.usersService.getOne({ email });

    if (existingUser) {
      return await this.generateTokens(existingUser.id, res);
    }

    const createdUser = await this.usersService.createOne({
      email,
    });

    return await this.generateTokens(createdUser.id, res);
  }

  async generateTokens(userId: number, res: Response) {
    const accessToken = await this.jwtService.signAsync(
      { userId },
      {
        secret: this.configService.getOrThrow('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.getOrThrow('JWT_ACCESS_EXPIRES'),
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { userId },
      {
        secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.getOrThrow('JWT_REFRESH_EXPIRES'),
      },
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return accessToken;
  }
}
