import { ApiProperty, OmitType } from '@nestjs/swagger';
import { SignupLoginOutput } from '../types/login-output.type';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
export class AuthDto {
  @ValidateIf((v) => !v.phone && v.email)
  @IsEmail()
  @ApiProperty({
    description: 'users email ',
    example: 'example@gmail.com',
    type: String,
    required: true,
  })
  email: string;

  @IsNotEmpty()
  @MinLength(8, { message: ' The min length of password is 8 ' })
  @MaxLength(20, {
    message: " The password can't accept more than 20 characters ",
  })
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,20}$/, {
    message:
      ' A password at least contains one numeric digit, one supercase char and one lowercase char',
  })
  @ApiProperty({
    description: 'user password ',
    example: '224*34523fsaf',
    type: String,
    required: true,
  })
  password: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    description: 'date of birth',
    example: '1990-01-01',
    type: Date,
    required: false,
  })
  dateOfBirth?: Date | string;
}

export class RegisterDto extends AuthDto {}

export class LoginDto extends OmitType(AuthDto, ['dateOfBirth']) {}

export class LoginOutputDto {
  @ApiProperty({ type: String, required: true })
  accessToken: string;

  @ApiProperty({ type: String, required: false })
  refreshToken?: string;
}

export class RegisterOutputDto extends OmitType(RegisterDto, [
  'email',
  'password',
]) {}
