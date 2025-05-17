import {
  Controller,
  Get,
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
import { createReadStream } from 'fs';
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
    const filepath = join(this.config.storage.dir, filename);
    const file = createReadStream(join(process.cwd(), filepath));
    file.pipe(res);
  }
}
