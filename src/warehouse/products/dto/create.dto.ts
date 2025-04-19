import { OmitType } from '@nestjs/swagger'
import { Product } from '../entity/products.entity'

export class ProductCreateDto extends OmitType(Product, ['id']) {}
