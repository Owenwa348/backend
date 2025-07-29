import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'กูอยากจะบ้ากับการเขียนโปรแกรม';
  }
}
