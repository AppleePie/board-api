import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccountsModule } from '../accounts/accounts.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { LoggerModule } from 'src/logger/logger.module';

@Global()
@Module({
  imports: [
    AccountsModule,
    PassportModule,
    LoggerModule,
    JwtModule.registerAsync({
      // wait reading config
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: process.env.JWT_LIFE_TIME ?? '15m' },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
