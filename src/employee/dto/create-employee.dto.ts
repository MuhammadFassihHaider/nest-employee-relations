import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { ContactInfo } from 'src/contact-info/entities/contact-info.entity';

export class CreateEmployeeDto {
  @IsString()
  @MinLength(3)
  @MaxLength(25)
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  contactInfo: ContactInfo;

  @ValidateIf((obj, value) => typeof value === 'number' || value === null)
  managerId: number | null;
}
