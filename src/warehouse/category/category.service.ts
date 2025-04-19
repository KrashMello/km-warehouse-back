import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { TryCatch } from 'src/decorators/core.decoratos'
import { PrismaService } from 'src/prisma/prisma.service'
import { Category } from './entity/category.entity'
import HttpResponse from 'src/utils/exceptios'
import { FindAllOptionsDto } from 'src/gobalsDto/findAllOptions.dto'

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  @TryCatch()
  private async count(search: string) {
    const query: Prisma.products_categoriesCountArgs = {
      where: {
        name: {
          contains: `%${search || ''}%`,
          mode: 'insensitive',
        },
      },
    }
    return await this.prisma.products_categories.count(query)
  }

  @TryCatch()
  async findAll(opt: FindAllOptionsDto) {
    const { search, limit, page } = opt
    const response: {
      categories: Category[]
      max_page: number
    } = {
      categories: [],
      max_page: 0,
    }
    const query: Prisma.products_categoriesFindManyArgs = {
      where: {
        name: {
          contains: `%${search || ''}%`,
          mode: 'insensitive',
        },
      },
    }
    if (limit && page) {
      query.take = limit
      query.skip = page * limit
      response.max_page = Math.ceil((await this.count(search)) / limit)
    }
    response.categories = await this.prisma.products_categories.findMany(query)
    return { data: response, status: 200 }
  }

  @TryCatch()
  async findOne(opt: { id?: number; name?: string }) {
    const { id, name } = opt
    const query: Prisma.products_categoriesFindFirstArgs = {
      where: {
        OR: [],
      },
    }
    if (id) query.where.OR.push({ id })
    if (name) query.where.OR.push({ name })
    const response = {
      data: await this.prisma.products_categories.findFirst(query),
      status: 200,
    }
    return response
  }

  @TryCatch()
  async create(opt: { name: string }) {
    const { name } = opt
    const exists = await this.findOne({ name })
    if (exists.data) HttpResponse({ data: 'EL NOMBRE YA EXISTE', status: 400 })
    const response = {
      data: await this.prisma.products_categories.create({
        data: {
          name,
        },
      }),
      status: 201,
    }
    return response
  }

  @TryCatch()
  async update(id: number, opt: { name: string }) {
    const { name } = opt
    const exists = await this.findOne({ name })
    if (exists.data && exists.data.id !== id)
      HttpResponse({ data: 'EL NOMBRE YA EXISTE', status: 400 })
    const response = {
      data: await this.prisma.products_categories.update({
        data: {
          name,
        },
        where: {
          id,
        },
      }),
      status: 200,
    }
    return response
  }
}
