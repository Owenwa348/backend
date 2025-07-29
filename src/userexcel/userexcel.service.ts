import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserExcel } from './userexcel.entity';

@Injectable()
export class UserExcelService {
  constructor(
    @InjectRepository(UserExcel)
    private userExcelRepository: Repository<UserExcel>,
  ) {}

  async addUserExcel(data: {
    name: string;
    email: string;
    phone: string;
  }): Promise<UserExcel> {
    const user = this.userExcelRepository.create(data);
    return await this.userExcelRepository.save(user);
  }

  async bulkInsert(
    users: {
      name: string;
      email: string;
      phone: string;
    }[],
  ): Promise<void> {
    // ดึง phone ทั้งหมดที่มีอยู่แล้วในฐานข้อมูล
    const phones = users.map((u) => u.phone);
    const existing = await this.userExcelRepository
      .createQueryBuilder('user')
      .where('user.phone IN (:...phones)', { phones })
      .getMany();

    const existingPhones = existing.map((u) => u.phone);
    if (existingPhones.length > 0) {
      throw new BadRequestException(`เบอร์โทรซ้ำ: 
        ${existingPhones.join(', ')}`);
    }

    // ไม่มีซ้ำ → สร้างและบันทึกได้เลย
    const entities = users.map((user) => this.userExcelRepository.create(user));
    await this.userExcelRepository.save(entities);
  }
}
