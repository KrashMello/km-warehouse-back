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
import { CategoryService } from './category.service'
import { FindAllOptionsDto } from 'src/gobalsDto/findAllOptions.dto'
import { CategoryParamDto } from './dto/findOne.dto'
import { CategoryCreateDto } from './dto/create.dto'
import { CategoryUpdateDto } from './dto/update.dto'
import HttpResponse from 'src/utils/exceptios'

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @Version('1')
  async findAll(@Query() query: FindAllOptionsDto) {
    HttpResponse(await this.categoryService.findAll(query))
  }

  @Get(':id')
  @Version('1')
  async findOne(@Param() param: CategoryParamDto) {
    HttpResponse(await this.categoryService.findOne({ id: +param.id }))
  }

  @Post()
  @Version('1')
  async create(@Body() body: CategoryCreateDto) {
    HttpResponse(await this.categoryService.create(body))
  }

  @Put(':id')
  @Version('1')
  async update(
    @Body() body: CategoryUpdateDto,
    @Param() param: CategoryParamDto,
  ) {
    HttpResponse(await this.categoryService.update(+param.id, body))
  }
}
