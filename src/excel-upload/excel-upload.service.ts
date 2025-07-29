import { Injectable } from '@nestjs/common';
import { UserExcelService } from '../userexcel/userexcel.service';
import * as ExcelJS from 'exceljs';

@Injectable()
export class UploadExcelService {
  constructor(private readonly userExcelService: UserExcelService) {}

  async uploadAndInsertExcel(buffer: Buffer): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
    const worksheet = workbook.worksheets[0];

    for (let i = 2; i <= worksheet.rowCount; i++) {
      const row = worksheet.getRow(i);
      const name = row.getCell(1).text.trim();
      const email = row.getCell(2).text.trim();
      const phone = row.getCell(3).text.trim();

      if (name && email && phone) {
        await this.userExcelService.addUserExcel({ name, email, phone });
      }
    }
  }
}
