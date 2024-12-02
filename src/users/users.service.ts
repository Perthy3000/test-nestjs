import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(user: CreateUserDto): Promise<User> {
    if (!user.username)
      throw new BadRequestException('INVALID DATA', {
        description: 'username is required',
      });

    if (!user.password)
      throw new BadRequestException('INVALID DATA', {
        description: 'password is required',
      });

    const existingUser = await this.usersRepository.findOneBy({
      username: user.username,
    });
    if (existingUser)
      throw new BadRequestException('INVALID DATA', {
        description: 'username already exists',
      });

    const encryptedPassword = await bcrypt.hash(user.password, 10);

    const newUser = new User();
    newUser.username = user.username;
    newUser.password = encryptedPassword;

    return this.usersRepository.save(newUser);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ username });
  }

  findById(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async delete(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
