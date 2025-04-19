import { OmitType } from '@nestjs/swagger'
import { Category } from '../entity/category.entity'

export class CategoryParamDto extends OmitType(Category, ['name']) {}
