import { Module } from '@nestjs/common'
import { SystemModule } from './system/system.module'
import { WarehouseModule } from './warehouse/warehouse.module'

@Module({
  imports: [SystemModule, WarehouseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
