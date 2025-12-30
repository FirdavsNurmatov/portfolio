import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from './entities/news.entity';
import { Like, ReactionType } from './entities/like.entity';
import { Comment } from './entities/comment.entity';
import { User } from 'src/users/entities/user.entity';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private newsRepo: Repository<News>,

    @InjectRepository(Like)
    private likeRepo: Repository<Like>,

    @InjectRepository(Comment)
    private commentRepo: Repository<Comment>,

    private http: HttpService,
  ) {}

  async fetchTopHeadlines(category: string) {
    const { data } = await this.http.axiosRef.get(
      'https://newsapi.org/v2/top-headlines',
      {
        params: {
          category,
          pageSize: 4,
          language: 'en',
          apiKey: process.env.NEWS_API_KEY,
        },
      },
    );
    return data.articles;
  }

  async saveNews(category: string, articles: any[]) {
    for (const item of articles) {
      if (!item.url) continue;

      const exists = await this.newsRepo.findOne({ where: { url: item.url } });
      if (exists) continue;

      const news = this.newsRepo.create({
        title: item.title,
        description: item.description,
        content: item.content,
        url: item.url,
        imageUrl: item.urlToImage,
        source: item.source?.name ?? 'Unknown',
        category,
        publishedAt: new Date(item.publishedAt),
      });

      await this.newsRepo.save(news);
    }
  }

  async toggleReaction(user: User, newsId: string, type: ReactionType) {
    const news = await this.newsRepo.findOneBy({ id: newsId });
    if (!news) throw new NotFoundException('News not found');

    const existing = await this.likeRepo.findOne({
      where: {
        user: { id: user.id },
        news: { id: newsId },
      },
      relations: ['user', 'news'],
    });

    // Agar reaction bor bo‘lsa
    if (existing) {
      // Xuddi shu reaction bo‘lsa → o‘chiramiz
      if (existing.type === type) {
        await this.likeRepo.remove(existing);
        return { active: false, type };
      }

      // Boshqa reaction bo‘lsa → update qilamiz
      existing.type = type;
      await this.likeRepo.save(existing);
      return { active: true, type };
    }

    // Umuman yo‘q bo‘lsa → yaratamiz
    const reaction = this.likeRepo.create({ user, news, type });
    await this.likeRepo.save(reaction);

    return { active: true, type };
  }

  async addComment(user: User, newsId: string, content: string) {
    const news = await this.newsRepo.findOneBy({ id: newsId });
    if (!news) throw new NotFoundException('News not found');

    const comment = this.commentRepo.create({ content, user, news });
    return this.commentRepo.save(comment);
  }

  async getAllNews(category?: string, userId?: string, page = 1, limit = 5) {
    const skip = (page - 1) * limit;

    const qb = this.newsRepo
      .createQueryBuilder('news')

      // comments
      .leftJoinAndSelect('news.comments', 'comment')
      .leftJoin('comment.user', 'commentUser')
      .addSelect(['commentUser.name'])

      // likes/dislikes
      .leftJoin('news.likes', 'like')
      .leftJoin('like.user', 'likeUser')

      // counts + myReaction
      .addSelect([
        `COUNT(CASE WHEN like.type = 'LIKE' THEN 1 END) AS "likesCount"`,
        `COUNT(CASE WHEN like.type = 'DISLIKE' THEN 1 END) AS "dislikesCount"`,
        `MAX(CASE WHEN likeUser.id = :userId THEN like.type ELSE NULL END) AS "myReaction"`,
      ])
      .setParameter('userId', userId)

      .orderBy('news.publishedAt', 'DESC')
      .skip(skip)
      .take(limit + 1) // 🔥 hasMore uchun +1

      .groupBy('news.id')
      .addGroupBy('comment.id')
      .addGroupBy('commentUser.id');

    if (category) {
      qb.where('news.category = :category', { category });
    }

    const { entities, raw } = await qb.getRawAndEntities();

    // 🔥 hasMore aniqlash
    const hasMore = entities.length > limit;

    const slicedEntities = hasMore ? entities.slice(0, limit) : entities;

    return {
      data: slicedEntities.map((news, index) => ({
        ...news,
        likes: {
          like: parseInt(raw[index].likesCount) || 0,
          dislike: parseInt(raw[index].dislikesCount) || 0,
        },
        myReaction: raw[index].myReaction ?? null,
      })),
      hasMore,
    };
  }

  async getNewsById(id: string, userId: string) {
    try {
      const qb = this.newsRepo
        .createQueryBuilder('news')
        .leftJoinAndSelect('news.comments', 'comment')
        .leftJoinAndSelect('comment.user', 'commentUser')
        .leftJoin('news.likes', 'like')
        .leftJoin('like.user', 'likeUser')
        .addSelect([
          `COUNT(CASE WHEN like.type = 'LIKE' THEN 1 END) AS "likesCount"`,
          `COUNT(CASE WHEN like.type = 'DISLIKE' THEN 1 END) AS "dislikesCount"`,
          `MAX(CASE WHEN likeUser.id = :userId THEN like.type ELSE NULL END) AS "myReaction"`,
        ])
        .where('news.id = :id', { id })
        .setParameter('userId', userId)
        .groupBy('news.id')
        .addGroupBy('comment.id')
        .addGroupBy('commentUser.id');

      const { entities, raw } = await qb.getRawAndEntities();

      if (!entities[0]) throw new NotFoundException('News not found');

      const news = entities[0];
      const r = raw[0];

      return {
        ...news,
        likes: {
          like: parseInt(r.likesCount) || 0,
          dislike: parseInt(r.dislikesCount) || 0,
        },
        myReaction: r.myReaction ?? null,
      };
    } catch (error) {
      throw error;
    }
  }
}
