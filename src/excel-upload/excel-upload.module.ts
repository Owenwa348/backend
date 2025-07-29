import { Module } from '@nestjs/common';
import { ExcelUploadController } from './excel-upload.controller';
import { UserExcelModule } from '../userexcel/userexcel.module';

@Module({
  imports: [UserExcelModule],
  controllers: [ExcelUploadController],
})
export class ExcelUploadModule {}
