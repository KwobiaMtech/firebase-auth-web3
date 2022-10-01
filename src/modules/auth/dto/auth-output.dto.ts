import { ApiProperty } from '@nestjs/swagger';

export class AuthOutputDto {
  @ApiProperty({ type: String, required: true })
  token: string;

  @ApiProperty({ type: String, required: false })
  refreshToken?: string;
}
