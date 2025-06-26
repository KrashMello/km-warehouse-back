import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Patch,
  Put,
  Version,
  UseGuards,
} from '@nestjs/common'
import { UserService } from './user.service'
import { UserCreateDto } from './dto/create.dto'
import { FindAllOptionsDto } from 'src/gobalsDto/findAllOptions.dto'
import { UserUpdateDto } from './dto/update.dto'
import { UserParamDto } from './dto/params.dto'
import { ApiTags } from '@nestjs/swagger'
import HttpResponse from 'src/utils/exceptios'
import { Public } from 'src/decorators/core.decoratos'

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Version('1')
  async findAll(@Query() params: FindAllOptionsDto): Promise<any> {
    HttpResponse(await this.userService.findAll(params))
  }

  @Get(':id')
  @Version('1')
  async findOne(@Param() params: UserParamDto): Promise<any> {
    HttpResponse(await this.userService.findOne({ id: +params.id }))
  }

  @Post()
  @Version('1')
  @Public()
  async create(
    @Body()
    body: UserCreateDto,
  ) {
    HttpResponse(await this.userService.create(body))
  }

  @Patch(':id')
  @Version('1')
  async update(
    @Body()
    body: UserUpdateDto,
    @Param() params: UserParamDto,
  ) {
    HttpResponse(await this.userService.update(+params.id, body))
  }

  //TODO: recordar eliminar este endpoint por que no tiene centido tenerlo aqui

  @Put('block/:id')
  @Version('1')
  async block(@Param() params: UserParamDto) {
    HttpResponse(await this.userService.blockAndUnblock(+params.id))
  }
}
