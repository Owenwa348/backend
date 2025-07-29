// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExcelUploadModule } from './excel-upload/excel-upload.module';
import { UserExcel } from './userexcel/userexcel.entity';
import { UserExcelModule } from './userexcel/userexcel.module';
import { AdminUser } from './admin-user/admin-user.entity';
import { AdminUserModule } from './admin-user/admin-user.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql', // หรือ 'sqlite', 'postgres' ตามที่คุณใช้
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Tunwalolza10',
      database: 'testproject',
      entities: [UserExcel, AdminUser],
      synchronize: true,
    }),
    ExcelUploadModule,
    UserExcelModule,
    AdminUserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
