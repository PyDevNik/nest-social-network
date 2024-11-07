import {
  Body,
  Param,
  Controller,
  Get,
  Post,
  Patch,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post as PrismaPost } from '@prisma/client';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async get() {
    return await this.postsService.get();
  }

  @Post()
  async createOne(@Body() dto: CreatePostDto): Promise<PrismaPost> {
    return await this.postsService.createOne(dto);
  }

  @Patch(':id')
  async updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePostDto,
  ) {
    return await this.postsService.updateOne(id, dto);
  }

  @Delete(':id')
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    return await this.postsService.deleteOne(id);
  }
}
