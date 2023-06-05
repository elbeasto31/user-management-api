import { Role } from "../enums/role.enum";
import { IsEnum, IsNotEmpty } from 'class-validator';
import { LoginDto } from "./login.dto";

export class RegisterDto extends LoginDto {
  readonly bossName: string;
  readonly subordinates: string[];

  @IsNotEmpty()
  @IsEnum(Role)
  readonly role: Role;
}
