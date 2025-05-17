import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Injectable()
export class UserByIdPipe implements PipeTransform {
  constructor(private readonly usersService: UsersService) {}
  async transform(value: string) {
    const user = await this.usersService.getById(Number(value));
    if (!user) {
      throw new NotFoundException(`user with id ${value} not found`);
    }
    return user;
  }
}
