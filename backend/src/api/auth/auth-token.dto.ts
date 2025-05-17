import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class AuthTokenDTO {
  @ApiProperty({
    example: 'abcde123abcde123abcde123',
    description: 'access token',
  })
  access_token: string;
}
