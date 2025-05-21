import {
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService, FileUploadResultDTO } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseAuthQuard } from '../auth/jwt-auth.guard';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';
import { Response } from 'express';
import { AppConfigService } from 'src/config/config.service';

@Controller('api/uploads')
export class UploadsController {
  constructor(
    private readonly fileService: FilesService,
    private readonly config: AppConfigService,
  ) {}

  @Get(':filename')
  streamFile(@Param('filename') filename: string, @Res() res: Response) {
    let filepath = join(this.config.storage.dir, filename);
    if (filepath.startsWith('.')) filepath = join(process.cwd(), filepath);
    if (existsSync(filepath)) {
      const file = createReadStream(filepath);
      file.pipe(res);
    } else {
      throw new InternalServerErrorException();
    }
  }
}
