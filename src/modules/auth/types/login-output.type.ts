import { ApiProperty } from '@nestjs/swagger';

export class SignupLoginOutput {
  @ApiProperty({ type: String, required: true })
  token: string;

  @ApiProperty({ type: String, required: false })
  refreshToken?: string;
}
