import { Controller, Get } from '@nestjs/common'
import { ModulesService } from './modules.service'
import { HttpResponse } from 'src/utils/exceptios'

@Controller('modules')
export class ModulesController {
  constructor(private modulesService: ModulesService) {}
  @Get()
  getModules() {
    HttpResponse(this.modulesService.findAll())
  }
}
