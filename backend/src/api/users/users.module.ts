import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { User } from 'src/database/entities/user.entity';
import { SocialLink } from 'src/database/entities/social-link.entity';
import { SocialLinksService } from './social-links.service';
import { DiariesModule } from '../diaries/diaries.module';
import { UsersProfileController } from './users.profile.controller';
import { UsersSocialLinksController } from './users.sociallinks.controller';
import { UsersDiariesController } from './users.diaries.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([SocialLink]),
    DiariesModule,
  ],
  providers: [UsersService, SocialLinksService],
  controllers: [
    UsersController,
    UsersProfileController,
    UsersSocialLinksController,
    UsersDiariesController,
  ],
  exports: [UsersService],
})
export class UsersModule {}
