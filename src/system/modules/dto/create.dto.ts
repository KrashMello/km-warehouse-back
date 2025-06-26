import { OmitType, PickType } from '@nestjs/swagger'
import { Module } from '../entity/module.entity'

export class CreateModuleDto extends OmitType(Module, [
  'id',
  'tree_level',
  'status',
]) {}
