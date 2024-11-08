import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import { GetUserDto } from './dtos/get-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}
  async createOne({ email, hashedPassword }: CreateUserDto) {
    const existingUser = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const createdUser = await this.prismaService.user.create({
      data: { email, hashedPassword },
    });

    return createdUser;
  }

  async getOne({ id, email }: GetUserDto) {
    if (!id && !email) {
      throw new BadRequestException();
    }

    const user = await this.prismaService.user.findFirst({
      where: { id, email },
    });

    return user;
  }
}
