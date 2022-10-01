import { Module } from '@nestjs/common';
import { MixedAuthGuard } from './guards/mixed-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { globalConfig } from 'src/config';

import { FirebaseAuthService } from './services/firebase-auth.service';
import { UserAuthController } from './controllers/user-auth.controller';
import { FireormModule } from 'nestjs-fireorm';
import { User } from './collections/user.collection';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [globalConfig.KEY],
      useFactory: async (cfg: ConfigType<typeof globalConfig>) => {
        return {
          secret: cfg.auth.jwt.secret,
          signOptions: {
            expiresIn: cfg.auth.accessToken.expiresIn,
          },
        };
      },
    }),
    FireormModule.forFeature([User]),
  ],
  controllers: [UserAuthController],
  providers: [FirebaseAuthService, MixedAuthGuard],
  exports: [FirebaseAuthService, MixedAuthGuard],
})
export class AuthModule {}
