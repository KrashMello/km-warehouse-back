import { Module } from '@nestjs/common'
import { InventoryModule } from './inventory/inventory.module'
import { APP_GUARD, RouterModule } from '@nestjs/core'
import { RouteGuard } from 'src/guard/route.guard'
import { AuthModule } from 'src/system/auth/auth.module'

@Module({
  imports: [
    AuthModule,
    InventoryModule,
    RouterModule.register([
      {
        path: 'warehouse',
        children: [InventoryModule],
      },
    ]),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RouteGuard,
    },
  ],
})
export class WarehouseModule {}
