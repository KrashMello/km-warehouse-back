import { PickType } from '@nestjs/swagger'
import { Status } from '../entity/status.entity'

export class UpdateStatusDto extends PickType(Status, ['name']) {}
