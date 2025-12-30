import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';

interface AccessTokenResult {
  access_token: string;
  access_token_expire_time: string | undefined;
}

interface RefreshTokenResult {
  refresh_token: string;
  refresh_token_expire_time: string | undefined;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService,
  ) {}

  async register(email: string, password: string, name?: string) {
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) throw new BadRequestException('User already exists');

    const hashed = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      email,
      password: hashed,
      name,
      provider: 'local',
    });
    await this.userRepository.save(user);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture,
      refreshToken: user.refreshToken,
    };
  }

  async login(user: any, response: Response) {
    try {
      const accessToken = await this.generateAccessToken({
        userId: user.id,
        email: user.email,
      });
      const accessTokenExpireTime = new Date(
        Date.now() +
          parseInt(accessToken.access_token_expire_time || '5') * 60 * 1000,
      );

      const refreshToken = await this.generateRefreshToken({
        userId: user.id,
        email: user.email,
        createdAt: Date.now(),
      });
      const refreshTokenExpireTime = new Date(
        Date.now() +
          parseInt(refreshToken.refresh_token_expire_time || '5') *
            86400 *
            1000,
      );
      await this.userRepository.update(
        { id: user.id },
        { refreshToken: await bcrypt.hash(refreshToken.refresh_token, 10) },
      );

      response.cookie('accessToken', accessToken.access_token, {
        httpOnly: true,
        secure: this.configService.get('environment') === 'production',
        sameSite: 'lax', // XSRF hujumlardan himoya
        expires: accessTokenExpireTime,
      });
      response.cookie('refreshToken', refreshToken.refresh_token, {
        httpOnly: true,
        secure: this.configService.get('environment') === 'production',
        sameSite: 'lax', // XSRF hujumlardan himoya
        expires: refreshTokenExpireTime,
      });
    } catch (error) {
      throw new BadRequestException('Something gone wrong');
    }
  }

  async findOrCreateGoogleUser(profile: any, response: Response) {
    try {
      const { email, firstName, lastName, picture } = profile;

      let user = await this.userRepository.findOne({ where: { email } });
      if (user) {
        user.provider = 'google';
        user.name = `${firstName} ${lastName}`;
        user.picture = picture;
        await this.userRepository.save(user);
      } else {
        user = this.userRepository.create({
          email,
          name: `${firstName} ${lastName}`,
          picture,
          provider: 'google',
        });
        await this.userRepository.save(user);
      }

      await this.login(user, response);

      // Frontendga redirect qilish, query param orqali token yuboramiz
      return response.redirect(`http://localhost:5173/`);
    } catch (error) {
      return response.status(400).json({ message: 'Something went wrong' });
    }
  }

  async verifyUser(email: string, password: string) {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) throw new UnauthorizedException('Invalid credentials');
      else if (!user.password)
        throw new UnauthorizedException('Login via Google, please!');

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new UnauthorizedException('Invalid credentials');

      return user;
    } catch (error) {
      throw new UnauthorizedException(error.messsage);
    }
  }

  async verifyUserRefreshToken(refreshToken: string, userId: string) {
    try {
      const user = await this.usersService.findOne(userId);
      const authenticated = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );
      if (!authenticated) {
        throw new UnauthorizedException('Refresh token is not valid.');
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  async generateAccessToken(payload: any): Promise<AccessTokenResult> {
    const accessTokenExpireTime = this.configService.get(
      'jwt.accessTokenExpireTime',
    );

    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('jwt.accessTokenSecret'),
      expiresIn: accessTokenExpireTime,
    });

    return {
      access_token: token,
      access_token_expire_time: accessTokenExpireTime,
    };
  }

  async generateRefreshToken(payload: any): Promise<RefreshTokenResult> {
    const refreshTokenExpireTime = this.configService.get(
      'jwt.refreshTokenExpireTime',
    );

    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('jwt.refreshTokenSecret'),
      expiresIn: refreshTokenExpireTime,
    });

    return {
      refresh_token: token,
      refresh_token_expire_time: refreshTokenExpireTime,
    };
  }
}
