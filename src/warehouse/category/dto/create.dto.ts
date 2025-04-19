import { OmitType } from '@nestjs/swagger'
import { Category } from '../entity/category.entity'

export class CategoryCreateDto extends OmitType(Category, ['id']) {}
