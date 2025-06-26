import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/prisma/prisma.module'
import { ModulesService } from './modules.service'
import { ModulesController } from './module.controller'

@Module({
  imports: [PrismaModule],
  controllers: [ModulesController],
  providers: [ModulesService],
  exports: [ModulesService],
})
export class ModulesModule {}
