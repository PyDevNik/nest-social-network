import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { Post, PostPrivacyEnum } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(userId: number) {
    // TODO: implement user friends privacy
    return await this.prismaService.post.findMany({
      where: {
        OR: [
          { privacy: PostPrivacyEnum.everyone },
          { privacy: PostPrivacyEnum.onlyUser, userId: userId },
        ],
      },
    });
  }

  async getMy(userId: number) {
    return await this.prismaService.post.findMany({ where: { userId } });
  }

  async createOne(
    { title, description, privacy }: CreatePostDto,
    userId: number,
  ): Promise<Post> {
    const post = await this.prismaService.post.create({
      data: { title, description, privacy, userId },
    });

    return post;
  }

  async updateOne(id: number, dto: UpdatePostDto, userId: number) {
    await this.getOneOrThrow(id);

    const updatedPost = await this.prismaService.post.update({
      where: { id, userId },
      data: dto,
    });

    return updatedPost;
  }

  async deleteOne(id: number, userId: number) {
    await this.getOneOrThrow(id);

    const deletedTask = await this.prismaService.post.delete({
      where: { id, userId },
    });

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
