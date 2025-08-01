// src/userexcel/userexcel.controller.ts
import { Controller, Get } from '@nestjs/common';
import { UserExcelService } from './userexcel.service';

@Controller('user_excel')
export class UserExcelController {
  constructor(private readonly userExcelService: UserExcelService) {}

  @Get()
  async getAllUsers() {
    return await this.userExcelService.findAll();
  }
}
