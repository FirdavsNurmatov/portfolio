import { Comment } from 'src/news/entities/comment.entity';
import { Like } from 'src/news/entities/like.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // --- Universal fields ---
  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  picture: string;

  @Column({ nullable: true })
  password: string; // hashed password (bcrypt)

  @Column({ nullable: true })
  refreshToken: string; // hashed refreshToken (bcrypt)

  // --- For Google OAuth users ---
  @Column({ nullable: true })
  googleId: string;

  @Column({ default: 'local' })
  provider: string; // local | google | github | etc.

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}
