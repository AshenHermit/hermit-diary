import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { AppConfigModule } from 'src/config/config.module';
import { AppConfigService } from 'src/config/config.service';
import { UploadsController } from './uploads.controller';
import { slugify } from 'transliteration';

export function cleanFilename(filename: string): string {
  filename = slugify(filename);

  filename = filename
    .replace(/[^\w.-]/g, '-') // заменяем всё кроме букв, цифр, точек и дефисов на _
    .replace(/^_+|_+$/g, '') // убираем подчёркивания в начале и конце
    .toLowerCase(); // можно сделать всё в нижнем регистре, если нужно
  return filename;
}

@Module({
  imports: [
    AppConfigModule,
    MulterModule.registerAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => {
        return {
          storage: diskStorage({
            destination: config.storage.dir,
            filename: (req, file, cb) => {
              let filename = Buffer.from(file.originalname, 'latin1').toString(
                'utf8',
              );
              filename = cleanFilename(filename);
              filename = `${Date.now()}-${filename}`;
              cb(null, filename);
            },
          }),
        };
      },
    }),
  ],
  controllers: [FilesController, UploadsController],
  providers: [FilesService],
})
export class FilesModule {}
