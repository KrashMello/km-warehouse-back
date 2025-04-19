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
import { FindAllOptionsDto } from 'src/gobalsDto/findAllOptions.dto'
import { ProductsService } from './products.service'
import { ProductParamDto } from './dto/param.dto'
import { ProductCreateDto } from './dto/create.dto'
import HttpResponse from 'src/utils/exceptios'

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @Version('1')
  async findAll(@Query() query: FindAllOptionsDto) {
    HttpResponse(await this.productsService.findAll(query))
  }

  @Get(':id')
  @Version('1')
  async findOne(@Param() param: ProductParamDto) {
    HttpResponse(await this.productsService.findOne({ id: +param.id }))
  }

  @Post()
  @Version('1')
  async create(@Body() body: ProductCreateDto) {
    HttpResponse(await this.productsService.create(body))
  }

  @Put(':id')
  @Version('1')
  async update(
    @Body() body: ProductCreateDto,
    @Param() param: ProductParamDto,
  ) {
    HttpResponse(await this.productsService.update(+param.id, body))
  }
}
