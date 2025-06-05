import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { opt } from 'src/utils/exceptios'

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}

  findAll(): opt {
    return {
      data: 'permissions',
      type: 'SUCCESS',
      status: HttpStatus.OK,
    }
  }
}
