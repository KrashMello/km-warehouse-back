import { PickType } from '@nestjs/swagger'
import { Roles } from '../entity/roles.entity'

export class CreateRolesDto extends PickType(Roles, ['name']) {}
