import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { Post } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}

  async get() {
    return await this.prismaService.post.findMany();
  }

  async createOne(dto: CreatePostDto): Promise<Post> {
    const post = await this.prismaService.post.create({
      data: dto,
    });

    return post;
  }

  async updateOne(id: number, dto: UpdatePostDto) {
    await this.getOneOrThrow(id);

    const updatedPost = await this.prismaService.post.update({
      where: { id },
      data: dto,
    });

    return updatedPost;
  }

  async deleteOne(id: number) {
    await this.getOneOrThrow(id);

    const deletedTask = await this.prismaService.post.delete({ where: { id } });

    return deletedTask;
  }

  // Private methods
  private async getOneOrThrow(id: number) {
    const post = await this.prismaService.post.findUnique({ where: { id } });

    if (!post) {
      throw new NotFoundException('Could not find Post with this ID');
    }

    return post;
  }
}
