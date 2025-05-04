import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Version,
} from '@nestjs/common'
import { RolesService } from './roles.service'
import { UpdateRolesDto } from './dto/update.dto'
import { CreateRolesDto } from './dto/create.dto'
import { GlobalParamDto } from 'src/gobalsDto/param.dto'
import { FindAllOptionsDto } from 'src/gobalsDto/findAllOptions.dto'
import { Public } from 'src/decorators/core.decoratos'
import HttpResponse from 'src/utils/exceptios'

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @Version('1')
  @Public()
  async findAll(@Query() opt: FindAllOptionsDto) {
    HttpResponse(await this.rolesService.findAll(opt))
  }

  @Get(':id')
  @Version('1')
  @Public()
  async findOne(@Param() param: GlobalParamDto) {
    HttpResponse(await this.rolesService.findOne({ id: +param.id }))
  }

  @Post()
  @Version('1')
  @Public()
  async create(@Body() opt: CreateRolesDto) {
    HttpResponse(await this.rolesService.create(opt))
  }

  @Put(':id')
  @Version('1')
  @Public()
  async update(@Param() param: GlobalParamDto, @Body() opt: UpdateRolesDto) {
    HttpResponse(await this.rolesService.update(+param.id, opt))
  }
}
