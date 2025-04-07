import { Injectable } from '@nestjs/common'
import { TryCatch } from 'src/decorators/core.decoratos'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  @TryCatch()
  private async count() {
    return await this.prisma.inventory.count()
  }

  @TryCatch()
  async findAll(opt: { search: string; limit?: number; page?: number }) {
    const { search, limit, page } = opt
    return await this.prisma.inventory.findMany({
      where: {
        name: {
          contains: search,
        },
      },
      take: limit,
      skip: page,
    })
  }
}
