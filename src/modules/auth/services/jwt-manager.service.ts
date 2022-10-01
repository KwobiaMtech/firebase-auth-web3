import { globalConfig } from './../../../config';
import { Injectable, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { addSeconds } from 'date-fns';
import { Repository } from 'typeorm';
import { AuthUserEntity } from '../entities/auth-user.entity';
import { RefreshTokenEntity } from '../entities/refresh-token.entity';

export interface RefreshTokenPayload {
  id: string;
}

@Injectable()
export class JwtManagerService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(RefreshTokenEntity)
    private refreshTokenRepository: Repository<RefreshTokenEntity>,
    @Inject(globalConfig.KEY) private config: ConfigType<typeof globalConfig>,
  ) {}

  async issueAccessToken(user: AuthUserEntity) {
    const payload = {
      sub: user.id,
      roles: user.roles,
    };
    return this.jwtService.sign(payload, {
      expiresIn: this.config.auth.accessToken.expiresIn,
    });
  }

  /**
   * Returns a base64-encoded refresh token
   * @param user
   */
  async generateRefreshToken(user: AuthUserEntity): Promise<string> {
    const token = new RefreshTokenEntity();
    token.user = user;
    token.expiresAt = addSeconds(
      Date.now(),
      this.config.auth.refreshToken.expiresIn,
    );
    await this.refreshTokenRepository.insert(token);
    const payload: RefreshTokenPayload = {
      id: token.id,
    };
    return Buffer.from(JSON.stringify(payload)).toString('base64');
  }
}
