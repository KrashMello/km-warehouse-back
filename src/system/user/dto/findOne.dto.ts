import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsNumberString,
  IsOptional,
} from 'class-validator';

export class FindOneDto {
  @ApiProperty({
    example: 'test',
  })
  @IsAlphanumeric()
  @IsOptional()
  username?: string;
  @ApiProperty({
    example: 'test@test.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;
  @ApiProperty({
    example: 1,
  })
  @IsNumberString()
  @IsOptional()
  id?: number;
}
