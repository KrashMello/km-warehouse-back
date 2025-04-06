import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { UserCreateDto } from './dto/create.dto'
import { FindAllOptionsDto } from 'src/gobalsDto/findAllOptions.dto'
import { FindUser } from './entity/user.entity'
import { FindOneDto } from './dto/findOne.dto'
import { UserUpdateDto } from './dto/update.dto'
import { FindUserCredentialsDto } from './dto/findUserCredentials.dto'
import { TryCatch } from 'src/decorators/core.decoratos'
import HttpResponse from 'src/utils/exceptios'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  private counterLimitAccess: Record<string, number> = {}

  @TryCatch()
  private async count() {
    return await this.prisma.users.count()
  }

  @TryCatch()
  async findAll(opt: FindAllOptionsDto) {
    const { search, page, limit } = opt
    const response: { data: FindUser[]; max_pages?: number } = { data: [] }
    const queryOptions: Prisma.usersFindManyArgs = {}
    if (search)
      queryOptions.where = {
        OR: [
          {
            username: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      }

    if (page && limit) {
      queryOptions.skip = +page * +limit
      queryOptions.take = +limit
      const max_users = await this.count()
      response.max_pages = Math.ceil(max_users / +limit) - 1
    }
    const data = await this.prisma.users.findMany({
      ...queryOptions,
      include: {
        user_personal_data: true,
      },
    })
    response.data = data.map((user) => {
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        status_id: user.status_id,
        firstname: user.user_personal_data.firstname,
        lastname: user.user_personal_data.lastname,
        birthdate: JSON.stringify(user.user_personal_data.birthdate)
          .match(/\d{4}-\d{2}-\d{2}/g)
          .toString(),
        phone_number: user.user_personal_data.phone_number,
      }
    })
    return { data: response, status: 200 }
  }

  @TryCatch()
  async findOne(opt: FindOneDto) {
    const { id, username, email } = opt
    if (!id && !username && !email)
      HttpResponse({
        data: 'id o email o username son requeridos',
        status: 400,
      })
    const queryOptions: Prisma.usersFindFirstArgs = { where: { OR: [] } }
    if (id) queryOptions.where.OR = [{ id: { equals: id } }]
    if (username)
      queryOptions.where.OR = [
        ...queryOptions.where.OR,
        { username: { equals: username } },
      ]
    if (email)
      queryOptions.where.OR = [
        ...queryOptions.where.OR,
        { email: { equals: email } },
      ]
    const user = await this.prisma.users.findFirst({
      include: { user_personal_data: true },
      ...queryOptions,
    })
    return {
      data: !user
        ? user
        : {
            id: user.id,
            username: user.username,
            email: user.email,
            status_id: user.status_id,
            firstname: user.user_personal_data.firstname,
            lastname: user.user_personal_data.lastname,
            birthdate: JSON.stringify(user.user_personal_data.birthdate)
              .match(/\d{4}-\d{2}-\d{2}/g)
              .toString(),
            phone_number: user.user_personal_data.phone_number,
          },
      status: 200,
    }
  }

  @TryCatch()
  async findUserCredentials(opt: FindUserCredentialsDto) {
    const { username, email } = opt
    if (!username && !email)
      HttpResponse({ data: 'username y email son requeridos', status: 400 })
    const queryOptions: Prisma.usersFindFirstArgs = { where: { OR: [] } }
    if (username)
      queryOptions.where.OR = [
        ...queryOptions.where.OR,
        { username: { equals: username } },
      ]
    if (email)
      queryOptions.where.OR = [
        ...queryOptions.where.OR,
        { email: { equals: email } },
      ]

    return await this.prisma.users.findFirst({
      select: {
        email: true,
        username: true,
        password: true,
        id: true,
        status_id: true,
      },
      ...queryOptions,
    })
  }

  @TryCatch()
  async create(opt: UserCreateDto) {
    const {
      username,
      password,
      email,
      firstname,
      lastname,
      birthdate,
      phone_number,
    } = opt
    const userExists = await this.findOne({ username, email })
    const userData = userExists.data
    if (userData && userData.username === username)
      HttpResponse({ data: 'el usuario ya existe', status: 400 })
    if (userData && userData.email === email)
      HttpResponse({ data: 'el correo ya existe', status: 400 })

    const queryOptions: Prisma.usersCreateArgs = {
      data: {
        username,
        password,
        email,
        status_id: 1,
        roles_by_users: {
          create: {
            role_id: 3,
          },
        },
        user_personal_data: {
          create: {
            firstname,
            lastname,
            birthdate: new Date(birthdate),
            phone_number,
          },
        },
      },
      include: {
        user_personal_data: true,
      },
    }
    const user = await this.prisma.users.create(queryOptions)
    return { data: await this.findOne({ id: user.id }), status: 201 }
  }

  @TryCatch()
  async update(id: number, opt: UserUpdateDto) {
    const { phone_number, lastname, firstname, email, birthdate } = opt
    const queryOptions: Prisma.usersUpdateArgs = {
      data: {
        email,
        user_personal_data: {
          update: {
            data: {
              phone_number,
              lastname,
              firstname,
              birthdate,
            },
            where: {
              user_id: id,
            },
          },
        },
      },
      where: {
        id,
      },
    }
    await this.prisma.users.update(queryOptions)
    const user = await this.findOne({ id })
    return { data: user.data, status: 200 }
  }

  @TryCatch()
  async updateLimitAccess(username: string) {
    const user = await this.findOne({ username })
    if (!this.counterLimitAccess[user.data.id]) {
      this.counterLimitAccess[user.data.id] = 1
      return this.counterLimitAccess[user.data.id]
    }
    this.counterLimitAccess[user.data.id] =
      this.counterLimitAccess[user.data.id] + 1
    const counter = this.counterLimitAccess[user.data.id]
    if (counter > 2) {
      delete this.counterLimitAccess[user.data.id]
    }
    return counter
  }

  // NOTE: debes cambiar esta funcion mas adante por el simple block
  @TryCatch()
  async blockAndUnblock(id: number) {
    const user = await this.findOne({ id })
    if (!user) HttpResponse({ data: 'usuario no encontrado', status: 404 })
    const actual_status = user.data.status_id
    const status_id = actual_status === 2 ? 1 : 2
    return {
      data: await this.prisma.users.update({
        data: {
          status_id,
        },
        where: {
          id,
        },
      }),
      status: 200,
    }
  }
}
