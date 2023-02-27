import { IsEmail, IsAlphanumeric } from 'class-validator';

export class AuthDTO {
  @IsEmail()
  email: string;

  @IsAlphanumeric()
  password: string;
}
