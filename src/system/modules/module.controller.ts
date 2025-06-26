import { Body, Controller, Get, Post, Query, Version } from '@nestjs/common'
import { ModulesService } from './modules.service'
import { HttpResponse } from 'src/utils/exceptios'
import { CreateModuleDto } from './dto/create.dto'
import { FindAllOptionsDto } from 'src/gobalsDto/findAllOptions.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Modules')
@Controller('modules')
export class ModulesController {
  constructor(private modulesService: ModulesService) {}
  @Get()
  @Version('1')
  async getModules(@Query() query: FindAllOptionsDto) {
    HttpResponse(await this.modulesService.findAll(query))
  }
  @Post()
  @Version('1')
  async createModule(@Body() body: CreateModuleDto) {
    HttpResponse(await this.modulesService.create(body))
  }
}
