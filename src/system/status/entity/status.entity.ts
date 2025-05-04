import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsAlpha,
  IsNumber,
  IsOptional,
  Length,
  ValidateNested,
} from 'class-validator'
import { User } from 'src/system/user/entity/user.entity'

export class Status {
  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  id: number
  @ApiProperty({
    example: 'Active',
  })
  @IsAlpha()
  @Length(5, 20)
  name: string
  @ApiProperty({
    type: [User],
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => User)
  users?: Partial<User>[]
}
