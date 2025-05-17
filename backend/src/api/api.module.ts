import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { NotesModule } from './notes/notes.module';
import { PropertiesModule } from './properties/properties.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    FilesModule,
    NotesModule,
    PropertiesModule,
  ],
})
export class ApiModule {}
