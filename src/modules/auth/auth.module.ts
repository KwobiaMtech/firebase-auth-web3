import { Module } from '@nestjs/common';
import { JwtStrategy } from './guards/jwt.strategy';
import { MixedAuthGuard } from './guards/mixed-auth.guard';
import { JwtManagerService } from './services/jwt-manager.service';
import { PasswordEncoderService } from './services/password-encorder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirebaseIdentityEntity } from './entities/firebase-identity.entity';
import { AuthUserEntity } from './entities/auth-user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { globalConfig } from 'src/config';
import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { AuthService } from './services/auth.service';
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
  providers: [FirebaseAuthService, MixedAuthGuard, JwtStrategy],
  exports: [FirebaseAuthService, MixedAuthGuard, JwtStrategy],
})
export class AuthModule {}
