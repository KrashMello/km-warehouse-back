import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateRolesDto } from './dto/create.dto'
import { UpdateRolesDto } from './dto/update.dto'
import { TryCatch } from 'src/decorators/core.decoratos'
import HttpResponse from 'src/utils/exceptios'
import { Prisma } from '@prisma/client'
import { Roles } from './entity/roles.entity'

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}
  @TryCatch()
  private async count(search: string) {
    return await this.prisma.roles.count({
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
    })
  }

  @TryCatch()
  async findAll(opt: { search?: string; page?: number; limit?: number }) {
    const { search, page, limit } = opt
    const query: Prisma.rolesFindManyArgs = {}
    const response: { roles: Roles[]; max_page?: number } = { roles: [] }
    if (search)
      query.where = {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      }
    if (limit && page) {
      query.take = limit
      query.skip = page * limit
      response.max_page = Math.ceil((await this.count(search)) / limit)
    }
    return { data: response, status: 200 }
  }

  @TryCatch()
  async findOne(opt: { id?: number; name?: string }) {
    const { id, name } = opt
    if (!id && !name)
      HttpResponse({
        data: 'ID O NOMBRE SON OBLIGATORIOS PARA EJECUTAR UNA BUSQUEDA',
        status: 401,
      })
    const data: Roles = await this.prisma.roles.findFirst({
      where: {
        OR: [
          { id },
          {
            name: {
              contains: name,
              mode: 'insensitive',
            },
          },
        ],
      },
    })

    return { data, status: 200 }
  }

  @TryCatch()
  async create(opt: CreateRolesDto) {
    const { name } = opt
    const verifyName = await this.findOne({ name })
    if (verifyName.data)
      HttpResponse({ data: 'EL NOMBRE DEL ROL YA EXISTE', status: 409 })
    const role = await this.prisma.roles.create({
      data: {
        name,
      },
    })
    return { data: role, status: 201 }
  }

  @TryCatch()
  async update(id: number, opt: UpdateRolesDto) {
    const { name, enabled } = opt
    const verifyId = await this.findOne({ id })
    if (!verifyId.data) HttpResponse({ data: 'EL ROL NO EXISTE', status: 409 })
    const verifyName = await this.findOne({ name })
    if (verifyName.data.name && verifyName.data.id !== id)
      HttpResponse({ data: 'EL NOMBRE DEL ROL YA EXISTE', status: 409 })
    const role = await this.prisma.roles.update({
      data: {
        name,
        enabled,
      },
      where: {
        id,
      },
    })
    return { data: role, status: 200 }
  }
}
