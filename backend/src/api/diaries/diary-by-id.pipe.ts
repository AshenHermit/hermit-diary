import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { DiariesService } from './diaries.service';

@Injectable()
export class DiaryByIdPipe implements PipeTransform {
  constructor(private readonly diariesService: DiariesService) {}
  async transform(value: string) {
    const diary = await this.diariesService.getById(Number(value));
    if (!diary) {
      throw new NotFoundException(`diary with id ${value} not found`);
    }
    return diary;
  }
}
