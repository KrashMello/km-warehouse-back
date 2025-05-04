import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { TryCatch } from 'src/decorators/core.decoratos'
import { PrismaService } from 'src/prisma/prisma.service'
import { Status } from './entity/status.entity'
import HttpResponse from 'src/utils/exceptios'

@Injectable()
export class StatusService {
  constructor(private readonly prisma: PrismaService) {}
  @TryCatch()
  async count(search: string) {
    return await this.prisma.users_status.count({
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
    })
  }
  @TryCatch()
  async findAll(opt: {
    search?: string
    limit?: number
    page?: number
  }) {
    const { search, limit, page } = opt
    const query: Prisma.users_statusFindManyArgs = {}
    const response: { status: Status[]; max_page?: number } = { status: [] }
    if (search) {
      query.where = {
        name: { contains: search, mode: 'insensitive' },
      }
    }
    if (limit && page) {
      query.take = limit
      query.skip = page * limit
      response.max_page = Math.ceil((await this.count(search)) / limit)
    }
    response.status = await this.prisma.users_status.findMany(query)
    return { data: response, status: 200 }
  }
  @TryCatch()
  async findOne(opt: { id?: number; name?: string }) {
    const { id, name } = opt
    if (!id && !name)
      HttpResponse({ data: 'ID O NAME SON REQUERIDOS', status: 401 })

    const data: Status = await this.prisma.users_status.findFirst({
      where: {
        OR: [
          {
            id: {
              equals: id,
            },
          },
          {
            name: {
              equals: name,
            },
          },
        ],
      },
    })
    return { data, status: 200 }
  }

  @TryCatch()
  async create(opt: { name: string }) {
    const { name } = opt
    const verifyName = await this.findOne({ name })
    if (verifyName.data)
      return { data: 'EL NOMBRE DEL ESTATUS YA EXISTE', status: 409 }
    const status = await this.prisma.users_status.create({
      data: {
        name,
      },
    })
    return { data: status, status: 201 }
  }
  @TryCatch()
  async update(
    id: number,
    opt: {
      name: string
    },
  ) {
    const { name } = opt
    const verifyId = await this.findOne({ id })
    if (!verifyId.data) return { data: 'EL ESTATUS NO EXISTE', status: 409 }
    const verifyName = await this.findOne({ name })
    if (verifyName.data.name && verifyName.data.id !== id)
      return { data: 'EL NOMBRE DEL ESTATUS YA EXISTE', status: 409 }
    const status = await this.prisma.users_status.update({
      data: {
        name,
      },
      where: {
        id,
      },
    })
    return { data: status, status: 200 }
  }
}
