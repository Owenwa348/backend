// src/import/import.service.ts
import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ImportService {
  async importUsersFromExcel(buffer: Buffer): Promise<{ email: string }[]> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);

    const worksheet = workbook.worksheets[0];
    const users: { email: string }[] = [];

    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1) return;

      const email = row.getCell(1).text.trim();

      if (email) {
        users.push({ email });
      }
    });

    return users;
  }
}
