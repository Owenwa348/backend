import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserExcel } from './userexcel.entity';
import { UserExcelService } from './userexcel.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserExcel])],
  providers: [UserExcelService],
  exports: [UserExcelService],
})
export class UserExcelModule {}
