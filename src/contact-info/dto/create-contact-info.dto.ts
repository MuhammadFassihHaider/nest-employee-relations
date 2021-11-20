import { IsEmail, IsPhoneNumber } from 'class-validator';

export class CreateContactInfoDto {
  @IsPhoneNumber()
  phone: number;

  @IsEmail()
  email: string;
}
