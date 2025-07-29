import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entities/users.entity';
import { CreateUsersDto } from './dto/create-userlist.dto';
import { UpdateUsersDto } from './dto/update-userlist.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async create(CreateUsersDto: CreateUsersDto): Promise<Users> {
    const user = this.usersRepository.create(CreateUsersDto);
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<Users[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<Users | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async update(id: number, dto: UpdateUsersDto): Promise<Users> {
    await this.usersRepository.update(id, dto);
    const updatedUser = await this.usersRepository.findOneBy({ id });
    if (!updatedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return updatedUser;
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
