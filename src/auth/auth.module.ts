import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AdminUser } from '../admin-user/admin-user.entity';
import { UserExcel } from '../userexcel/userexcel.entity';
import { JwtModule } from '@nestjs/jwt';
import { OtpService } from './otp.service';
import { AdminUserModule } from '../admin-user/admin-user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminUser, UserExcel]),
    JwtModule.register({
      secret: 'mySecretKey',
      signOptions: { expiresIn: '1h' },
    }),
    AdminUserModule,
  ],
  providers: [AuthService, OtpService],
  controllers: [AuthController],
})
export class AuthModule {}
