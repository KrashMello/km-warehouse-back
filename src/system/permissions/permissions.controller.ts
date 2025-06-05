import { Controller, Get } from '@nestjs/common'
import { HttpResponse } from 'src/utils/exceptios'
import { PermissionsService } from './permissions.services'

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}
  @Get()
  findAll() {
    HttpResponse(this.permissionsService.findAll())
  }
}
