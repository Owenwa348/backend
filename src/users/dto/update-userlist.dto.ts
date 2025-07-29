import { PartialType } from '@nestjs/mapped-types';
import { CreateUsersDto } from './create-userlist.dto';

export class UpdateUsersDto extends PartialType(CreateUsersDto) {}
