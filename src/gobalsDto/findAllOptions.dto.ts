import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

export class FindAllOptionsDto {
  @ApiProperty({
    name: 'search',
    example: '',
  })
  @IsOptional()
  search?: string;
  @ApiProperty({
    name: 'page',
    example: 1,
  })
  @IsOptional()
  @IsNumberString()
  page?: number;
  @ApiProperty({
    name: 'limit',
    example: 10,
  })
  @IsOptional()
  @IsNumberString()
  limit?: number;
}
