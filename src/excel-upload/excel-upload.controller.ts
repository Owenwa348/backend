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

@Controller('excel-upload')
export class ExcelUploadController {
  constructor(private readonly userExcelService: UserExcelService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadExcel(@UploadedFile() file: Express.Multer.File) {
    if (!file.originalname.endsWith('.xlsx')) {
      //CSVต้องรองรับด้วย
      throw new BadRequestException('Only .xlsx files are supported');
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file.buffer);
    const worksheet = workbook.worksheets[0];

    const result: { name: string; email: string; phone: string }[] = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // skip header

      const name = row.getCell(1).text.trim();
      const email = row.getCell(2).text.trim();
      const phone = row.getCell(3).text.trim();

      if (name && email && phone) {
        result.push({ name, email, phone });
      }
    });

    if (result.length === 0) {
      throw new BadRequestException('No valid data found in Excel file');
    }

    return this.userExcelService.bulkInsert(result);
  }
}
