import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminUser } from './admin-user.entity';

@Injectable()
export class AdminUserService {
  constructor(
    @InjectRepository(AdminUser)
    private repo: Repository<AdminUser>,
  ) {}

  findAll() {
    return this.repo.find({ order: { id: 'DESC' } });
  }

  async create(data: Partial<AdminUser>) {
    const existing = await this.repo.findOne({ where: { email: data.email } });
    if (existing) throw new BadRequestException('อีเมลนี้มีอยู่แล้ว');
    const admin = this.repo.create(data);
    return this.repo.save(admin);
  }

  async updateRole(id: number, role: string) {
    const admin = await this.repo.findOneBy({ id });
    if (!admin) throw new NotFoundException();
    admin.role = role === 'SuperAdmin' ? 'SuperAdmin' : 'Admin';
    return this.repo.save(admin);
  }

  async updateStatus(id: number, active: boolean) {
    const admin = await this.repo.findOneBy({ id });
    if (!admin) throw new NotFoundException();
    admin.active = active;
    return this.repo.save(admin);
  }

  async remove(id: number) {
    const admin = await this.repo.findOneBy({ id });
    if (!admin) throw new NotFoundException();
    return this.repo.remove(admin);
  }
}
