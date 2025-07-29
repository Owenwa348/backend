import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { AdminUserService } from './admin-user.service';
import { CreateAdminDto } from './dto/create-admin.dto';

@Controller('admin')
export class AdminUserController {
  constructor(private readonly service: AdminUserService) {}

  @Get()
  getAll() {
    return this.service.findAll();
  }

  @Post('create')
  create(@Body() body: CreateAdminDto) {
    return this.service.create(body);
  }

  @Patch(':id/role')
  changeRole(
    @Param('id') id: string,
    @Body() body: { role: 'Admin' | 'SuperAdmin' },
  ) {
    return this.service.updateRole(+id, body.role);
  }

  @Patch(':id/status')
  toggleStatus(
    @Param('id')
    id: string,
    @Body() body: { active: boolean },
  ) {
    return this.service.updateStatus(+id, body.active);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
