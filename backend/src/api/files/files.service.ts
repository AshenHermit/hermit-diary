import { BadRequestException, Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { AppConfigService } from 'src/config/config.service';

@Expose()
export class FileUploadResultDTO {
  @ApiProperty({ description: 'message' })
  message: string;
  @ApiProperty({ description: 'file path' })
  filePath: string;
  @ApiProperty({ description: 'url' })
  url: string;
}

@Injectable()
export class FilesService {
  constructor(private readonly config: AppConfigService) {}
  handleFileUpload(file: Express.Multer.File): FileUploadResultDTO {
    if (!file) {
      throw new BadRequestException('no file uploaded');
    }

    const sizeMB = 5;
    const maxSize = sizeMB * 1024 * 1024; // 5mb
    if (file.size > maxSize) {
      throw new BadRequestException(`file size is greater than ${sizeMB}mb`);
    }
    const url = `/uploads/${file.filename}`;
    return {
      message: 'file uploaded succsessfully',
      filePath: file.path,
      url: url,
    };
  }
}
