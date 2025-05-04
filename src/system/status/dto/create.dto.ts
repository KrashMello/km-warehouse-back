import { PickType } from '@nestjs/swagger'
import { Status } from '../entity/status.entity'

export class CreateStatusDto extends PickType(Status, ['name']) {}
