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
    return await this.postsService.getOne(postId, userId);
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
