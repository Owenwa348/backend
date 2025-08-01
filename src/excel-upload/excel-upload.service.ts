// src/upload-excel/upload-excel.service.ts
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

      const title = this.getCellValueOrNull(row.getCell(1));
      const name = this.getCellValueOrNull(row.getCell(2));
      const email = this.getCellValueOrNull(row.getCell(3));
      const phone = this.getCellValueOrNull(row.getCell(4));
      const agencyEVP = this.getCellValueOrNull(row.getCell(5));
      const agencySVP = this.getCellValueOrNull(row.getCell(6));
      const agencyDM = this.getCellValueOrNull(row.getCell(7));
      const area = this.getCellValueOrNull(row.getCell(8));
      const yearWork = this.getCellValueOrNull(row.getCell(9));

      await this.userExcelService.addUserExcel({
        title,
        name: name ?? '',
        email: email ?? '',
        phone,
        agencyEVP,
        agencySVP,
        agencyDM,
        area,
        yearWork,
      });
    }
  }

  private getCellValueOrNull(cell: ExcelJS.Cell): string | undefined {
    if (!cell || cell.value === null || cell.value === undefined)
      return undefined;
    if (typeof cell.value === 'string') return cell.value.trim() || undefined;
    if (typeof cell.value === 'number' || cell.value instanceof Date)
      return String(cell.value);
    return undefined;
  }
}
