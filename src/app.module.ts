import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { connectionSource } from 'ormconfig';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { globalConfig } from './config';
import { AuthModule } from './modules/auth/auth.module';
import { MainModule } from './modules/main/main.module';
import { FireormModule } from 'nestjs-fireorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      load: [globalConfig],
    }),
    FireormModule.forRoot({
      fireormSettings: { validateModels: true },
    }),
    AuthModule,
    MainModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
