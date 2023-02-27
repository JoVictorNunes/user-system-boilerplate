import { IsEmail, IsAlphanumeric } from 'class-validator';

export class RegisterDTO {
  @IsEmail()
  email: string;

  @IsAlphanumeric()
  password: string;
}
