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
import { StatusService } from './status.service'
import { GlobalParamDto } from 'src/gobalsDto/param.dto'
import HttpResponse from 'src/utils/exceptios'
import { FindAllOptionsDto } from 'src/gobalsDto/findAllOptions.dto'
import { UpdateStatusDto } from './dto/update.dto'
import { CreateStatusDto } from './dto/create.dto'
import { Public } from 'src/decorators/core.decoratos'

@Controller('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}
  @Get()
  @Version('1')
  async findAll(@Query() query: FindAllOptionsDto) {
    HttpResponse(await this.statusService.findAll(query))
  }
  @Get(':id')
  @Version('1')
  async findOne(@Param() param: GlobalParamDto) {
    HttpResponse(await this.statusService.findOne({ id: +param.id }))
  }
  @Post()
  @Version('1')
  @Public()
  async create(@Body() body: CreateStatusDto) {
    HttpResponse(await this.statusService.create(body))
  }
  @Put(':id')
  @Version('1')
  async update(@Param() param: GlobalParamDto, @Body() body: UpdateStatusDto) {
    HttpResponse(await this.statusService.update(+param.id, body))
  }
}
