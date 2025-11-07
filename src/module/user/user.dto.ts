import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  // IsStrongPassword,
  Length,
  Matches,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';
import { UserGender } from 'src/common/enums';
export class reSendOtpDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
export class confirmEmailDto extends reSendOtpDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{6}$/)
  code: string;
}
export class loginDto extends reSendOtpDto {
  @IsNotEmpty()
  // @IsStrongPassword()
  password: string;
}
export class signupDto extends loginDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 25)
  @ValidateIf((data: signupDto) => Boolean(!data.userName))
  fName: string;

  @IsString()
  @Length(3, 25)
  @IsNotEmpty()
  @ValidateIf((data: signupDto) => Boolean(!data.userName))
  lName: string;

  @IsString()
  @Length(3, 25)
  @IsNotEmpty()
  @ValidateIf((data: signupDto) => Boolean(!data.fName && !data.lName))
  userName: string;
  @IsNumber()
  @IsNotEmpty()
  @Min(18)
  @Max(60)
  age: number;

  @IsEnum(UserGender)
  @IsOptional()
  gender?: string;

  // @Validate(CustomValidator)
  @ValidateIf((data: signupDto) => Boolean(data.password))
  cPassword: string;
}
