import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '../enums/role.enum';

export class JwtDto {
  
  @IsNotEmpty()
  readonly username: string;
  
  @IsNotEmpty()
  @IsEnum(Role)
  readonly role: Role;
}