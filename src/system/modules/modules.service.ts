import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { opt } from 'src/utils/exceptios'

@Injectable()
export class ModulesService {
  constructor(private prisma: PrismaService) {}
  findAll(): opt {
    return {
      data: 'modules',
      type: 'SUCCESS',
      status: HttpStatus.OK,
    }
  }
}
