import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthguard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { ReactionType } from './entities/like.entity';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @UseGuards(JwtAuthguard)
  @Get()
  getAll(
    @CurrentUser() user: any,
    @Query('category') category?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '5',
  ) {
    return this.newsService.getAllNews(
      category,
      user.id,
      Number(page),
      Number(limit),
    );
  }

  @UseGuards(JwtAuthguard)
  @Get(':id')
  getById(@CurrentUser() user: any, @Param('id') id: string) {
    return this.newsService.getNewsById(id, user.id);
  }

  @UseGuards(JwtAuthguard)
  @Post(':id/like')
  like(@CurrentUser() user: User, @Param('id') id: string) {
    return this.newsService.toggleReaction(user, id, ReactionType.LIKE);
  }

  @UseGuards(JwtAuthguard)
  @Post(':id/dislike')
  dislike(@CurrentUser() user: User, @Param('id') id: string) {
    return this.newsService.toggleReaction(user, id, ReactionType.DISLIKE);
  }

  @UseGuards(JwtAuthguard)
  @Post(':id/comment')
  addComment(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body('content') content: string,
  ) {
    return this.newsService.addComment(user, id, content);
  }
}
