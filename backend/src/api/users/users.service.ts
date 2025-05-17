import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from '../auth/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDTO } from './update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDTO): Promise<User> {
    const { email, password, name, picture } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      name,
      picture: picture,
    });
    return this.usersRepository.save(user);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async getById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDTO): Promise<void> {
    const { password, name, picture, ...other } = updateUserDto;
    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;
    await this.usersRepository.update(id, {
      ...(password && { password: hashedPassword }),
      ...(name && { name }),
      ...(picture && { picture }),
      ...other,
    });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
