import { IsEmail, IsIn, IsString } from 'class-validator';

export class CreateAdminDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsIn(['Admin', 'SuperAdmin'])
  role: 'Admin' | 'SuperAdmin';
}
