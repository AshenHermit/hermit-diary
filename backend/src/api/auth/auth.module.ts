import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtSilentStrategy, JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { GoogleStrategy } from './google/auth-google.strategy';
import { AuthController } from './auth.controller';
import { AppConfigModule } from 'src/config/config.module';
import { AppConfigService } from 'src/config/config.service';

@Module({
  imports: [
    AppConfigModule,
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => {
        return {
          secret: config.site.authSecret,
          signOptions: { expiresIn: '30d' },
        };
      },
    }),
  ],
  providers: [AuthService, JwtStrategy, JwtSilentStrategy, GoogleStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
