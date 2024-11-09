import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { Dislike, Like, Post, PostPrivacyEnum } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getOne(postId: number, userId: number) {
    return await this.prismaService.post.findFirst({
      where: {
        id: postId,
        OR: [
          { privacy: PostPrivacyEnum.everyone },
          { privacy: PostPrivacyEnum.onlyUser, userId: userId },
        ],
      },
    });
  }

  async getOneLike(postId: number, userId: number) {
    return await this.prismaService.like.findFirst({
      where: { postId, userId },
    });
  }

  async getOneDislike(postId: number, userId: number) {
    return await this.prismaService.dislike.findFirst({
      where: { postId, userId },
    });
  }

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

  async createOneLike(postId: number, userId: number): Promise<Like> {
    const like = await this.prismaService.like.create({
      data: { postId, userId },
    });
    return like;
  }
  async createOneDislike(postId: number, userId: number): Promise<Dislike> {
    const dislike = await this.prismaService.dislike.create({
      data: { postId, userId },
    });
    return dislike;
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

    const deletedPost = await this.prismaService.post.delete({
      where: { id, userId },
    });

    return deletedPost;
  }

  async deleteOneLike(postId: number, userId: number) {
    const existingLike = await this.getOneLike(postId, userId);
    if (!existingLike) {
      throw new NotFoundException("Couldn't find like with this data");
    }
    const deletedLike = await this.prismaService.like.delete({
      where: { id: existingLike.id },
    });
    return deletedLike;
  }

  async deleteOneDislike(postId: number, userId: number) {
    const existingDislike = await this.getOneDislike(postId, userId);
    if (!existingDislike) {
      throw new NotFoundException("Couldn't find like with this data");
    }
    const deletedDislike = await this.prismaService.dislike.delete({
      where: { id: existingDislike.id },
    });
    return deletedDislike;
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
