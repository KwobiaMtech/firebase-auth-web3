import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';

import { GlobalConfig, globalConfig } from '../../../config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(globalConfig.KEY) cfg: GlobalConfig,
    // @InjectRepository(AuthUserEntity)
    // private repository: Repository<AuthUserEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: cfg.auth.jwt.secret,
    });
  }

  async validate(payload: any) {
    return payload;
    // const userId = payload.sub;
    // const user = this.repository.findOne({ where: { id: userId } });
    // if (!user) {
    //   return false;
    // }
    // return user;
  }
}
