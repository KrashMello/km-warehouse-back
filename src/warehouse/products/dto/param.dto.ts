import { PickType } from '@nestjs/swagger'
import { Product } from '../entity/products.entity'

export class ProductParamDto extends PickType(Product, ['id']) {}
