import { ApiProperty, OmitType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsAlphanumeric,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsUrl,
  Length,
  Matches,
  ValidateNested,
} from 'class-validator'
import { Category } from 'src/warehouse/category/entity/category.entity'

export class Product {
  @ApiProperty({
    example: 1,
  })
  @IsNumberString()
  @IsNotEmpty()
  id: number
  @ApiProperty({
    example: '1234567890123',
  })
  @IsNumberString()
  @IsNotEmpty()
  @Length(13, 13)
  SKU: string
  @ApiProperty({
    example: 'HARINA',
  })
  @IsAlphanumeric()
  @Length(6, 150)
  @IsNotEmpty()
  name: string
  @ApiProperty({
    example: 'HARINITA PARA COCINAR YA TU SABES',
  })
  @Matches(/^[a-z0-9 ]+$/i)
  @IsOptional()
  @Length(0, 500)
  description: string
  @ApiProperty({
    example: 50,
  })
  @IsNumber()
  @IsNotEmpty()
  stock: number
  @ApiProperty({
    type: OmitType(Category, ['name']),
  })
  @Type(() => OmitType(Category, ['name']))
  categories: Partial<Category>
  @ApiProperty({
    example: 5000,
  })
  @IsNumber()
  @IsNotEmpty()
  buy_price: number
  @ApiProperty({
    example: 5500,
  })
  @IsNumber()
  @IsOptional()
  sell_price: number
  @ApiProperty({
    example: 'http://localhost/resources/image/1',
  })
  @IsUrl({
    require_tld: false,
    require_host: false,
    require_protocol: false,
    allow_protocol_relative_urls: true,
  })
  @IsOptional()
  image: string
  @ApiProperty({
    example: 10,
  })
  @IsNumber()
  @IsOptional()
  stock_umbral: number
}
