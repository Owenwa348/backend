import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { UserExcel } from './userexcel.entity';

@Injectable()
export class UserExcelService {
  constructor(
    @InjectRepository(UserExcel)
    private userExcelRepository: Repository<UserExcel>,
  ) {}

  async addUserExcel(data: Partial<UserExcel>): Promise<UserExcel> {
    // ตรวจสอบข้อมูลซ้ำก่อนเพิ่มข้อมูลเดียว
    await this.checkDuplicateData([data]);

    const user = this.userExcelRepository.create(data);
    return this.userExcelRepository.save(user);
  }

  async bulkInsert(users: Partial<UserExcel>[]): Promise<UserExcel[]> {
    if (!users || users.length === 0) {
      throw new BadRequestException('ไม่มีข้อมูลให้อัปโหลด');
    }

    // ตรวจสอบข้อมูลซ้ำในฐานข้อมูล
    await this.checkDuplicateData(users);

    // ตรวจสอบข้อมูลซ้ำภายในชุดข้อมูลที่จะอัปโหลด
    this.checkDuplicateInBatch(users);

    const entities = this.userExcelRepository.create(users);
    return this.userExcelRepository.save(entities);
  }

  async findAll(): Promise<UserExcel[]> {
    return this.userExcelRepository.find();
  }

  // ตรวจสอบข้อมูลซ้ำในฐานข้อมูล
  private async checkDuplicateData(users: Partial<UserExcel>[]): Promise<void> {
    const phones = users.map((user) => user.phone).filter((phone) => phone);
    const emails = users.map((user) => user.email).filter((email) => email);

    // ตรวจสอบเบอร์โทรซ้ำ
    if (phones.length > 0) {
      const existingPhones = await this.userExcelRepository.find({
        where: { phone: In(phones) },
        select: ['phone'],
      });

      if (existingPhones.length > 0) {
        const duplicatePhones = existingPhones.map((user) => user.phone);
        throw new ConflictException(`
          เบอร์โทรเหล่านี้มีอยู่ในระบบแล้ว: ${duplicatePhones.join(', ')}`);
      }
    }

    // ตรวจสอบอีเมลซ้ำ
    if (emails.length > 0) {
      const existingEmails = await this.userExcelRepository.find({
        where: { email: In(emails) },
        select: ['email'],
      });

      if (existingEmails.length > 0) {
        const duplicateEmails = existingEmails.map((user) => user.email);
        throw new ConflictException(`
          อีเมลเหล่านี้มีอยู่ในระบบแล้ว: ${duplicateEmails.join(', ')}`);
      }
    }
  }

  // ตรวจสอบข้อมูลซ้ำภายในชุดข้อมูลที่จะอัปโหลด
  private checkDuplicateInBatch(users: Partial<UserExcel>[]): void {
    const phoneSet = new Set<string>();
    const emailSet = new Set<string>();
    const duplicates: string[] = [];

    users.forEach((user, index) => {
      // ตรวจสอบเบอร์โทรซ้ำ
      if (user.phone) {
        if (phoneSet.has(user.phone)) {
          duplicates.push(`เบอร์โทร "${user.phone}" ซ้ำในแถวที่ ${index + 1}`);
        } else {
          phoneSet.add(user.phone);
        }
      }

      // ตรวจสอบอีเมลซ้ำ
      if (user.email) {
        if (emailSet.has(user.email)) {
          duplicates.push(`อีเมล "${user.email}" ซ้ำในแถวที่ ${index + 1}`);
        } else {
          emailSet.add(user.email);
        }
      }
    });

    if (duplicates.length > 0) {
      throw new BadRequestException(`
        พบข้อมูลซ้ำในไฟล์ Excel: ${duplicates.join(', ')}`);
    }
  }

  // เมธอดเสริมสำหรับการค้นหาข้อมูลตามเงื่อนไข
  async findByPhone(phone: string): Promise<UserExcel | null> {
    return this.userExcelRepository.findOne({ where: { phone } });
  }

  async findByEmail(email: string): Promise<UserExcel | null> {
    return this.userExcelRepository.findOne({ where: { email } });
  }

  async findByArea(area: string): Promise<UserExcel[]> {
    return this.userExcelRepository.find({ where: { area } });
  }

  // เมธอดสำหรับอัปเดทข้อมูล (กรณีต้องการแก้ไขข้อมูลที่มีอยู่)
  async updateUserExcel(
    id: number,
    data: Partial<UserExcel>,
  ): Promise<UserExcel> {
    const existingUser = await this.userExcelRepository.findOne({
      where: { id },
    });
    if (!existingUser) {
      throw new BadRequestException('ไม่พบข้อมูลผู้ใช้');
    }

    // ตรวจสอบว่าข้อมูลที่จะอัปเดทไม่ซ้ำกับข้อมูลอื่น (ยกเว้นตัวเอง)
    if (data.phone && data.phone !== existingUser.phone) {
      const phoneExists = await this.userExcelRepository.findOne({
        where: { phone: data.phone },
      });
      if (phoneExists && phoneExists.id !== id) {
        throw new ConflictException('เบอร์โทรนี้มีอยู่ในระบบแล้ว');
      }
    }

    if (data.email && data.email !== existingUser.email) {
      const emailExists = await this.userExcelRepository.findOne({
        where: { email: data.email },
      });
      if (emailExists && emailExists.id !== id) {
        throw new ConflictException('อีเมลนี้มีอยู่ในระบบแล้ว');
      }
    }

    await this.userExcelRepository.update(id, data);
    const updatedUser = await this.userExcelRepository.findOne({
      where: { id },
    });

    if (!updatedUser) {
      throw new BadRequestException('ไม่สามารถดึงข้อมูลที่อัปเดทได้');
    }

    return updatedUser;
  }
}
