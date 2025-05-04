import { ApiProperty } from '@nestjs/swagger'
import { IsAlpha, IsBoolean, IsNumberString, Length } from 'class-validator'

export class Roles {
  @ApiProperty({
    example: '1',
  })
  @IsNumberString()
  id: number
  @ApiProperty({
    example: 'ADMIN',
  })
  @IsAlpha()
  @Length(5, 20)
  name: string
  @ApiProperty({
    example: true,
  })
  @IsBoolean()
  enabled: boolean
}
