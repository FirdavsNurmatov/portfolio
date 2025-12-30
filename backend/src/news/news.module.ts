import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from './entities/news.entity';
import { Like } from './entities/like.entity';
import { Comment } from './entities/comment.entity';
import { HttpModule } from '@nestjs/axios';
import { NewsCron } from './news.cron';

@Module({
  imports: [TypeOrmModule.forFeature([News, Like, Comment]), HttpModule],
  controllers: [NewsController],
  providers: [NewsService, NewsCron],
})
export class NewsModule {}
