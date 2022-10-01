import {
  Controller,
  UsePipes,
  ValidationPipe,
  Post,
  Req,
  Body,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';
import {
  RegisterDto,
  RegisterOutputDto,
  LoginDto,
  LoginOutputDto,
} from '../dto/auth.dto';
import { AuthOutputDto } from '../dto/auth-output.dto';
import { FirebaseAuthService } from '../services/firebase-auth.service';

@Controller()
@ApiBearerAuth('JWT')
@UsePipes(new ValidationPipe({ transform: true }))
@ApiTags('Auth')
export class UserAuthController {
  constructor(private firebaseService: FirebaseAuthService) {}

  @Post('api/login')
  @ApiResponse({
    status: 200,
    description: 'Login was successful.',
    type: AuthOutputDto,
  })
  async loginUser(@Body() dto: LoginDto): Promise<LoginOutputDto> {
    return await this.firebaseService.loginUser(dto);
  }

  @Post('user/create')
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully created.',
    type: AuthOutputDto,
  })
  async createUser(
    @Req() req: any,
    @Body() dto: RegisterDto,
  ): Promise<RegisterOutputDto> {
    return await this.firebaseService.createUser(dto);
  }
}
