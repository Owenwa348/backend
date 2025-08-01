import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserExcel } from './userexcel.entity';
import { UserExcelService } from './userexcel.service';
import { UserExcelController } from './userexcel.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserExcel])],
  controllers: [UserExcelController],
  providers: [UserExcelService],
  exports: [UserExcelService, TypeOrmModule],
})
export class UserExcelModule {}
