import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Patch,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreateDto } from './dto/create.dto';
import { FindAllOptionsDto } from 'src/gobalsDto/findAllOptions.dto';
import { FindOneDto } from './dto/findOne.dto';
import { UserUpdateDto } from './dto/update.dto';
import { UserParamDto } from './dto/params.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(@Query() params: FindAllOptionsDto): any {
    return this.userService.findAll(params);
  }

  @Get(':id')
  findOne(@Param() params: UserParamDto): any {
    return this.userService.findOne({ id: +params.id });
  }

  @Post()
  create(
    @Body()
    body: UserCreateDto,
  ) {
    return this.userService.create(body);
  }

  @Patch(':id')
  update(
    @Body()
    body: UserUpdateDto,
    @Param() params: UserParamDto,
  ) {
    return this.userService.update(+params.id, body);
  }

  //TODO: recordar eliminar este endpoint por que no tiene centido tenerlo aqui

  @Put('block/:id')
  block(@Param() params: UserParamDto) {
    return this.userService.blockAndUnblock(+params.id);
  }
}
