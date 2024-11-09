import {
  Body,
  Param,
  Controller,
  Get,
  Post,
  Patch,
  ParseIntPipe,
  Delete,
  UseGuards,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post as PrismaPost } from '@prisma/client';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guard';
import { CurrentUser } from 'src/utils/decorators/current-user.decorator';

@UseGuards(JwtAccessGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getAll(@CurrentUser('id', ParseIntPipe) userId: number) {
    return await this.postsService.getAll(userId);
  }

  @Get('my')
  async getMy(@CurrentUser('id', ParseIntPipe) userId: number) {
    return await this.postsService.getMy(userId);
  }

  @Get(':id')
  async getOne(
    @Param('id', ParseIntPipe) postId: number,
    @CurrentUser('id', ParseIntPipe) userId: number,
  ) {
    const post = await this.postsService.getOne(postId, userId);

    if (!post) {
      throw new NotFoundException("Post with this ID doesn't exist");
    }

    return post;
  }

  @Post(':id/like')
  async likePost(
    @Param('id', ParseIntPipe) postId: number,
    @CurrentUser('id', ParseIntPipe) userId: number,
  ) {
    const post = await this.postsService.getOne(postId, userId);

    if (!post) {
      throw new NotFoundException("Post with this ID doesn't exist");
    }

    const existingLike = await this.postsService.getOneLike(postId, userId);
    if (existingLike) {
      throw new BadRequestException('You have already liked this post.');
    }
    this.postsService.createOneLike(postId, userId);
  }

  @Post(':id/dislike')
  async dislikePost(
    @Param('id', ParseIntPipe) postId: number,
    @CurrentUser('id', ParseIntPipe) userId: number,
  ) {
    const post = await this.postsService.getOne(postId, userId);

    if (!post) {
      throw new NotFoundException("Post with this ID doesn't exist");
    }

    const existingDislike = await this.postsService.getOneDislike(
      postId,
      userId,
    );
    if (existingDislike) {
      throw new BadRequestException('You have already liked this post.');
    }
    this.postsService.createOneDislike(postId, userId);
  }

  @Delete(':id/like')
  async deleteOneLike(
    @Param('id', ParseIntPipe) postId: number,
    @CurrentUser('id', ParseIntPipe) userId: number,
  ) {
    return await this.postsService.deleteOneLike(postId, userId);
  }

  @Delete(':id/dislike')
  async deleteOneDislike(
    @Param('id', ParseIntPipe) postId: number,
    @CurrentUser('id', ParseIntPipe) userId: number,
  ) {
    return await this.postsService.deleteOneDislike(postId, userId);
  }

  @Post()
  async createOne(
    @Body() dto: CreatePostDto,
    @CurrentUser('id', ParseIntPipe) userId: number,
  ): Promise<PrismaPost> {
    return await this.postsService.createOne(dto, userId);
  }

  @Patch(':id')
  async updateOne(
    @Param('id', ParseIntPipe) postId: number,
    @Body() dto: UpdatePostDto,
    @CurrentUser('id', ParseIntPipe) userId: number,
  ) {
    return await this.postsService.updateOne(postId, dto, userId);
  }

  @Delete(':id')
  async deleteOne(
    @Param('id', ParseIntPipe) postId: number,
    @CurrentUser('id', ParseIntPipe) userId: number,
  ) {
    return await this.postsService.deleteOne(postId, userId);
  }
}
