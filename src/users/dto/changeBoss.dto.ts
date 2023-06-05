import { IsNotEmpty } from "class-validator";

export class ChangeBossDto {
  
    @IsNotEmpty()
    readonly username: string;
    @IsNotEmpty()
    readonly newBoss: string;
  }