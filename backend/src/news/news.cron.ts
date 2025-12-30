import { Injectable } from '@nestjs/common';
import { NewsService } from './news.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class NewsCron {
  private categories = [
    'general',
    'technology',
    'business',
    'science',
    'health',
  ];

  constructor(private newsService: NewsService) {}

  @Cron(CronExpression.EVERY_DAY_AT_7PM)
  async importDailyNews() {
    for (const category of this.categories) {
      const articles = await this.newsService.fetchTopHeadlines(category);
      console.log(articles);

      await this.newsService.saveNews(category, articles);
    }
  }
}
