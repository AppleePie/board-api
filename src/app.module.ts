import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AccountsModule } from './accounts/accounts.module';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from './logger/logger.module';
import { AdvertisementsModule } from './advertisements/advertisements.module';
import { Account } from './accounts/entities/account.entity';
import { Advertisement } from './advertisements/entities/advertisement.entity';
import { Image } from './advertisements/entities/image.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AccountsModule,
    AuthModule,
    LoggerModule,
    AdvertisementsModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'board-database',
      entities: [Account, Advertisement, Image],
      synchronize: true,
    }),
  ],
  controllers: [],
})
export class AppModule {}
