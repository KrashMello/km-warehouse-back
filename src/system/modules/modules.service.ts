import { HttpStatus, Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { TryCatch } from 'src/decorators/core.decoratos'
import { PrismaService } from 'src/prisma/prisma.service'
import { HttpResponse, opt } from 'src/utils/exceptios'
import { Module } from './entity/module.entity'
import { CreateModuleDto } from './dto/create.dto'
import { FindAllOptionsDto } from 'src/gobalsDto/findAllOptions.dto'

@Injectable()
export class ModulesService {
  constructor(private prisma: PrismaService) {}
  @TryCatch()
  async count(search: string) {
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
  async findAll(opt: FindAllOptionsDto): Promise<opt> {
    const { search, limit, page } = opt
    const queryOptions: Prisma.modulesFindManyArgs = {
      where: {
        OR: [
          {
            name: {
              contains: `%${search || ''}%`,
              mode: 'insensitive',
            },
            description: {
              contains: `%${search || ''}%`,
              mode: 'insensitive',
            },
          },
        ],
      },
    }

    const data: {
      modules: { id: number; name: string; description: string }[]
      maxpage?: number
      page?: number
    } = {
      modules: [],
    }

    if (page && limit) {
      queryOptions.skip = +page * +limit
      queryOptions.take = +limit
      const max_modules = await this.count(search)
      data.maxpage = Math.ceil(max_modules / +limit) - 1
      data.page = +page
    }

    data.modules = await this.prisma.modules.findMany(queryOptions)

    return {
      data,
      status: 200,
    }
  }

  @TryCatch()
  async findOne(opt: {
    id?: number
    name?: string
    pathern_id?: number
    type?: 'OR' | 'AND'
  }) {
    const { id, name, pathern_id, type } = opt

    if (!id && !name && !pathern_id) {
      HttpResponse({
        data: 'id o name o pathern_id son requeridos',
        status: 409,
      })
    }
    const queryOptions: Prisma.modulesFindFirstArgs = {
      where: {},
    }
    const searchType: 'OR' | 'AND' = type ?? 'OR'
    queryOptions.where[searchType] = []
    if (id)
      queryOptions.where[searchType].push({
        id: {
          equals: id,
        },
      })

    if (name)
      queryOptions.where[searchType].push({
        name: {
          equals: name,
        },
      })

    if (pathern_id)
      queryOptions.where[searchType].push({
        pathern_id: {
          equals: pathern_id,
        },
      })

    const module = await this.prisma.modules.findFirst(queryOptions)
    return {
      data: module,
      status: HttpStatus.OK,
    }
  }

  @TryCatch()
  async create(opt: CreateModuleDto): Promise<opt> {
    const { name, description, src, pathern_id, place } = opt
    const exists = await this.findOne({ name, pathern_id, type: 'AND' })
    if (exists.data && exists.data.name === name)
      HttpResponse({ data: 'el modulo ya existe', status: 409 })
    const data = {
      name,
      description,
      src,
      pathern_id: +pathern_id,
      tree_level: await this.getTreeLevel({ id: +pathern_id }),
      place: place ?? (await this.getPlace({ pathern_id: pathern_id ?? null })),
    }
    const queryOptions: Prisma.modulesCreateArgs = { data }

    const createData = await this.prisma.modules.create(queryOptions)
    const user = await this.findOne({ id: createData.id })
    return {
      data: user.data,
      status: HttpStatus.CREATED,
    }
  }

  @TryCatch()
  protected async getPlace(opt: { pathern_id: number | null }) {
    const { pathern_id } = opt
    const data = await this.prisma.modules.findFirst({
      select: {
        place: true,
      },
      where: {
        pathern_id,
      },
      orderBy: {
        place: 'desc',
      },
    })
    if (!data) return 0
    return data.place + 1
  }

  @TryCatch()
  protected async getTreeLevel(opt: { id: number | null }) {
    const { id } = opt
    if (!id) return 0
    const pathern = await this.findOne({ id })
    if (!pathern.data)
      HttpResponse({ data: 'el modulo no existe', status: 409 })
    const tree_level = pathern.data.tree_level + 1
    if (tree_level > 3)
      HttpResponse({ data: 'el modulo esta en un nivel superior', status: 409 })
    return tree_level
  }

  update(id: number) {
    return {
      data: 'modules ' + id,
      status: HttpStatus.OK,
    }
  }
}
