import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  controllers: [PostsController],
  imports: [PrismaModule],
  providers: [PostsService],
})
export class PostsModule {}
