// src/import/import.service.ts
import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { UsersService } from '../users/users.service';

@Injectable()
export class ImportService {
  constructor(private usersService: UsersService) {}

  async importUsersFromExcel(buffer: Buffer): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer); // โหลดจาก buffer

    const worksheet = workbook.worksheets[0]; // ใช้แผ่นแรก
    const Users: { email: string }[] = [];

    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      // ข้ามหัวตาราง (แถวที่ 1)
      if (rowNumber === 1) return;

      const email = row.getCell(1).text.trim();

      if (email) {
        Users.push({ email });
      }
    });
  }
}
