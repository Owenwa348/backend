import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}

  async findAll(): Promise<Admin[]> {
    return await this.adminRepository.find();
  }

  async createAdmin(data: {
    name: string;
    email: string;
    role: 'Admin' | 'SuperAdmin';
  }): Promise<Admin> {
    const existing = await this.adminRepository.findOne({
      where: {
        email: data.email,
      },
    });
    if (existing) throw new Error('Email already exists.');

    const admin = this.adminRepository.create(data);
    return await this.adminRepository.save(admin);
  }
}
