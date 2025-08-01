import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserExcelService } from '../userexcel/userexcel.service';
import * as ExcelJS from 'exceljs';

// Define interfaces for type safety
interface UserData {
  title: string;
  name: string;
  email: string;
  phone: string;
  agencyEVP: string | undefined;
  agencySVP: string | undefined;
  agencyDM: string | undefined;
  area: string;
  yearWork: string;
}

interface SkippedRow {
  rowNumber: number;
  reason: string;
  raw: ExcelJS.CellValue[] | { [key: string]: ExcelJS.CellValue };
}

@Controller('excel-upload')
export class ExcelUploadController {
  constructor(private readonly userExcelService: UserExcelService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadExcel(@UploadedFile() file: Express.Multer.File) {
    if (!file.originalname.endsWith('.xlsx')) {
      throw new BadRequestException('Only .xlsx files are supported');
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file.buffer);
    const worksheet = workbook.worksheets[0];

    // Specify types explicitly
    const importedRows: UserData[] = [];
    const skippedRows: SkippedRow[] = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // skip header

      const title = row.getCell(1).text.trim();
      const name = row.getCell(2).text.trim();
      const email = row.getCell(3).text.trim();
      const phone = row.getCell(4).text.trim();
      const agencyEVP = row.getCell(5).text.trim() || undefined;
      const agencySVP = row.getCell(6).text.trim() || undefined;
      const agencyDM = row.getCell(7).text.trim() || undefined;
      const area = row.getCell(8).text.trim();
      const yearWork = row.getCell(9).text.trim();

      if (title && name && email && phone && area && yearWork) {
        const userData: UserData = {
          title,
          name,
          email,
          phone,
          agencyEVP,
          agencySVP,
          agencyDM,
          area,
          yearWork,
        };
        importedRows.push(userData);
      } else {
        skippedRows.push({
          rowNumber,
          reason: 'Missing required fields',
          raw: row.values,
        });
        console.warn(
          `[Row ${rowNumber}] 
          SKIPPED - Missing required fields:`,
          row.values,
        );
      }
    });

    if (importedRows.length === 0) {
      throw new BadRequestException('No valid data found in Excel file');
    }

    // Insert into DB
    const result = await this.userExcelService.bulkInsert(importedRows);

    return {
      status: 'completed',
      imported: importedRows.length,
      skipped: skippedRows.length,
      skippedDetails: skippedRows,
      dbResult: result,
    };
  }
}
