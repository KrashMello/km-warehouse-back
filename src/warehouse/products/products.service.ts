import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { TryCatch } from 'src/decorators/core.decoratos'
import { PrismaService } from 'src/prisma/prisma.service'
import { Product } from './entity/products.entity'
import { ProductCreateDto } from './dto/create.dto'
import HttpResponse from 'src/utils/exceptios'
import { FindAllOptionsDto } from 'src/gobalsDto/findAllOptions.dto'

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  @TryCatch()
  private async count(search: string) {
    return await this.prisma.products.count({
      where: {
        OR: [
          {
            name: {
              contains: `%${search || ''}%`,
              mode: 'insensitive',
            },
          },
          {
            SKU: {
              contains: `%${search || ''}%`,
              mode: 'insensitive',
            },
          },
        ],
      },
    })
  }

  @TryCatch()
  async findAll(opt: FindAllOptionsDto) {
    const { search, limit, page } = opt
    const response: {
      products: Partial<Product>[]
      max_page?: number
    } = {
      products: [],
    }
    const query: Prisma.productsFindManyArgs = {
      where: {
        OR: [
          {
            name: {
              contains: `%${search || ''}%`,
              mode: 'insensitive',
            },
          },
          {
            SKU: {
              contains: `%${search || ''}%`,
              mode: 'insensitive',
            },
          },
        ],
      },
    }
    if (limit && page) {
      query.take = +limit
      query.skip = +page * +limit
      response.max_page = Math.ceil((await this.count(search)) / +limit) - 1
    }

    const data = await this.prisma.products.findMany({
      ...query,
      include: {
        categories: true,
      },
    })
    response.products = data.map((product) => {
      const {
        SKU,
        name,
        stock,
        image,
        categories: { name: category_name },
        sell_price,
      } = product
      return {
        SKU,
        name,
        stock,
        image,
        category_name,
        sell_price,
      }
    })
    return { data: response, status: 200 }
  }

  @TryCatch()
  async findOne(opt: { id?: number; SKU?: string; name?: string }) {
    const { id, SKU, name } = opt
    const response: { data: Product; status: number } = {
      data: null,
      status: 404,
    }
    const data = await this.prisma.products.findFirst({
      where: {
        OR: [
          {
            id,
          },
          {
            name: {
              contains: name,
            },
          },

          {
            SKU: {
              contains: SKU,
            },
          },
        ],
      },
      include: {
        categories: true,
      },
    })
    if (data) {
      response.data = data
      response.status = 200
    }
    return response
  }

  @TryCatch()
  async create(opt: ProductCreateDto) {
    const {
      SKU,
      name,
      buy_price,
      image,
      description,
      stock,
      stock_umbral,
      categories: { id: category_id },
      sell_price,
    } = opt
    const exists = await this.findOne({ SKU, name })
    const response: { data: Product; status: number } = {
      data: null,
      status: 404,
    }
    if (exists.data)
      HttpResponse({ data: 'EL SKU O EL NOMBRE YA EXISTE', status: 400 })
    await this.prisma.products.create({
      data: {
        SKU,
        name,
        buy_price,
        sell_price,
        stock,
        category_id,
        description,
        image,
        stock_umbral,
      },
    })
    const product = await this.findOne({ SKU })
    response.data = product.data
    response.status = 201
    return response
  }

  @TryCatch()
  async update(id: number, opt: ProductCreateDto) {
    const {
      SKU,
      name,
      buy_price,
      image,
      description,
      stock,
      stock_umbral,
      categories: { id: category_id },
      sell_price,
    } = opt
    const response: { data: Product; status: number } = {
      data: null,
      status: 404,
    }
    const exists = await this.findOne({ SKU, name })
    if (exists.data && exists.data.id !== id)
      HttpResponse({ data: 'EL SKU O EL NOMBRE YA EXISTE', status: 400 })
    this.prisma.products.update({
      data: {
        SKU,
        buy_price,
        sell_price,
        stock,
        category_id,
        description,
        image,
        stock_umbral,
        name,
      },
      where: {
        id,
      },
    })
    const product = await this.findOne({ id })
    response.data = product.data
    response.status = 200
    return response
  }
}
