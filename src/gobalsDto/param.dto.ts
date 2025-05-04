import { ApiProperty } from '@nestjs/swagger'
import { IsNumberString } from 'class-validator'

export class GlobalParamDto {
  @ApiProperty({
    example: 1,
  })
  @IsNumberString()
  id: number
}
