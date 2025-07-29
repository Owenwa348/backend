// src/admin/admin.controller.ts
import { Body, Controller, Get, Post } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  getAllAdmins() {
    return this.adminService.findAll();
  }

  @Post('create')
  createAdmin(
    @Body() body: { name: string; email: string; role: 'Admin' | 'SuperAdmin' },
  ) {
    return this.adminService.createAdmin(body);
  }
}
