import { HttpStatus, Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { TryCatch } from 'src/decorators/core.decoratos'
import { PrismaService } from 'src/prisma/prisma.service'
import { HttpResponse } from 'src/utils/exceptios'
import { Module } from './entity/module.entity'

@Injectable()
export class ModulesService {
  constructor(private prisma: PrismaService) {}
  @TryCatch()
  async count(search: string) {
    const { search } = opt
    const data = await this.prisma.modules.count({
      where: {
        OR: [
          {
            name: {
              contains: `%${search || ''}%`,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: `%${search || ''}%`,
              mode: 'insensitive',
            },
          },
        ],
      },
    })
    return data
  }

  @TryCatch()
  async findAll(opt: { search: string; limit?: number; page?: number }) {
    const { search, limit, page } = opt
    let queryOptions: Prisma.modulesFindManyArgs = {
      OR: [
        {
          name: {
            contains: `%${search || ''}%`,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: `%${search || ''}%`,
            mode: 'insensitive',
          },
        },
      ],
    }

    if (page && limit) {
      queryOptions.skip = +page * +limit
      queryOptions.take = +limit
      const max_modules = await this.count(search)

      const modules = await this.prisma.modules.findMany(queryOptions)
      return {
        data: {
          modules,
          maxpage: Math.ceil(max_modules / +limit) - 1,
          page: +page,
        },
        type: 'SUCCESS',
        status: HttpStatus.OK,
      }
    }

    const modules = await this.prisma.modules.findMany(queryOptions)
    return {
      data: { modules },
      type: 'SUCCESS',
      status: HttpStatus.OK,
    }
  }

  @TryCatch()
  async findOne(opt: { id?: number; name?: string }) {
    const { id, name } = opt

    if (!id && !name) {
      HttpResponse({
        data: 'id o name son requeridos',
        status: 409,
      })
    }
    const queryOptions: Prisma.modulesFindFirstArgs = {
      where: {
        OR: [],
      },
    }
    if (id) {
      queryOptions.where.OR.push({
        id: {
          equals: id,
        },
      })
    }
    if (name) {
      queryOptions.where.OR.push({
        name: {
          equals: name,
        },
      })
    }
    const module = await this.prisma.modules.findFirst(queryOptions)
    return {
      data: module,
      status: HttpStatus.OK,
    }
  }

  @TryCatch()
  async create(opt: Module) {
    const { name, description, src, pathern_id, tree_level, place } = opt
    const exists = await this.findOne({ name })
    if (exists.data && exists.data.name === name)
      HttpResponse({ data: 'el modulo ya existe', status: 409 })

    let queryOptions: Prisma.modulesCreateArgs
    if (name) queryOptions.data.name = name
    if (description) queryOptions.data.description = description
    if (src) queryOptions.data.src = src
    if (pathern_id) queryOptions.data.pathern_id = pathern_id
    if (tree_level) queryOptions.data.tree_level = tree_level
    if (place) queryOptions.data.place = place
    const data = await this.prisma.modules.create(queryOptions)
    return {
      data: await this.findOne({ id: data.id }),
      status: HttpStatus.CREATED,
    }
  }

  update(id: number) {
    return {
      data: 'modules ' + id,
      status: HttpStatus.OK,
    }
  }
}
