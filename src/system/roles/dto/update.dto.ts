import { PickType } from '@nestjs/swagger'
import { Roles } from '../entity/roles.entity'

export class UpdateRolesDto extends PickType(Roles, ['name', 'enabled']) {}
