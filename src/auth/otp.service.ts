import { Injectable } from '@nestjs/common';

@Injectable()
export class OtpService {
  private otpStore = new Map<string, string>();

  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  storeOtp(email: string, otp: string): void {
    this.otpStore.set(email, otp);
    console.log(`Stored OTP ${otp} for email ${email}`);
  }

  sendOtp(phone: string, otp: string): void {
    console.log(`Sending OTP ${otp} to phone ${phone}`);
    // mock การส่ง SMS จริง
  }

  verifyOtp(email: string, otp: string): boolean {
    const storedOtp = this.otpStore.get(email);
    return storedOtp === otp;
  }
}
