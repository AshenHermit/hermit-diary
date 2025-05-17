import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class GoogleAuthDTO {
  @ApiProperty({
    example: 'abcde123abcde123abcde123',
    description: 'google account id token',
  })
  id_token: string;
}
