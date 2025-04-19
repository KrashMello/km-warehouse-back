import { ApiProperty } from '@nestjs/swagger'
import { IsNumberString, IsOptional } from 'class-validator'

export class FindAllOptionsDto {
  @ApiProperty({
    name: 'search',
    required: false,
    example: '',
  })
  @IsOptional()
  search?: string
  @ApiProperty({
    name: 'page',
    required: false,
    example: 1,
  })
  @IsOptional()
  @IsNumberString()
  page?: number
  @ApiProperty({
    name: 'limit',
    required: false,
    example: 10,
  })
  @IsOptional()
  @IsNumberString()
  limit?: number
}
