import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/prisma/prisma.module'
import { StatusController } from './status.controller'
import { StatusService } from './status.service'

@Module({
  imports: [PrismaModule],
  controllers: [StatusController],
  providers: [StatusService],
  exports: [StatusService],
})
export class StatusModule {}
