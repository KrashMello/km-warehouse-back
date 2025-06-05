import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/prisma/prisma.module'
import { ModulesService } from './modules.service'

@Module({
  imports: [PrismaModule],
  providers: [ModulesService],
  exports: [ModulesService],
})
export class ModulesModule {}
