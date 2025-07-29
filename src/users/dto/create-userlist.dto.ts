import { UsersRole } from '../users-role.enum';

export class CreateUsersDto {
  name: string;
  password: string;
  email: string;
  agencyEVP?: string;
  agencySVP?: string;
  agencyDM?: string;
  area: string;
  isActive?: boolean;
  role?: UsersRole;
  createdAt?: Date;
  updatedAt?: Date;
}
