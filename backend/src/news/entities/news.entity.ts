import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Like } from './like.entity';
import { Comment } from './comment.entity';

@Entity()
export class News {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ unique: true })
  url: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column()
  source: string;

  @Column()
  category: string;

  @Column({ type: 'timestamptz' })
  publishedAt: Date;

  @OneToMany(() => Like, (like) => like.news)
  likes: Like[];

  @OneToMany(() => Comment, (comment) => comment.news)
  comments: Comment[];

  @CreateDateColumn()
  createdAt: Date;
}
