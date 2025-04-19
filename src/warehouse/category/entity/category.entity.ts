import { ApiProperty } from '@nestjs/swagger'
import {
  IsAlphanumeric,
  IsNotEmpty,
  IsNumberString,
  Length,
} from 'class-validator'

export class Category {
  @ApiProperty({
    example: 1,
  })
  @IsNotEmpty()
  @IsNumberString()
  id: number

  @ApiProperty({
    example: 'VIVERES',
  })
  @IsNotEmpty()
  @IsAlphanumeric()
  @Length(5, 50)
  name: string
}
