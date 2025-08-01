import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminUser } from '../admin-user/admin-user.entity';
import { UserExcel } from '../userexcel/userexcel.entity';
import { OtpService } from './otp.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AdminUser)
    private adminRepo: Repository<AdminUser>,
    @InjectRepository(UserExcel)
    private userRepo: Repository<UserExcel>,
    private jwtService: JwtService,
    private otpService: OtpService,
  ) {}

  async login(email: string) {
    const admin = await this.adminRepo.findOne({ where: { email } });
    if (admin) {
      const token = this.jwtService.sign({ email, role: admin.role });
      return { token, redirect: 'dashboard' };
    }

    const user = await this.userRepo.findOne({ where: { email } });
    if (user) {
      const otp = this.otpService.generateOtp();
      this.otpService.storeOtp(email, otp);
      console.log(`Sending OTP ${otp} to phone ${user.phone}`);

      return { redirect: 'otp' };
    }

    throw new NotFoundException('Email not found');
  }

  verifyOtp(email: string, otp: string) {
    const isValid = this.otpService.verifyOtp(email, otp);
    if (!isValid) throw new BadRequestException('Invalid OTP');

    const token = this.jwtService.sign({ email, role: 'user' });
    return { token, redirect: 'assessment' };
  }
}
