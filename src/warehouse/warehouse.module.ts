import { Module } from '@nestjs/common'
import { ProductsModule } from './products/products.module'
import { APP_GUARD, RouterModule } from '@nestjs/core'
import { RouteGuard } from 'src/guard/route.guard'
import { AuthModule } from 'src/system/auth/auth.module'
import { CategoryModule } from './category/category.module'

@Module({
  imports: [
    AuthModule,
    ProductsModule,
    CategoryModule,
    RouterModule.register([
      {
        path: 'warehouse',
        children: [ProductsModule, CategoryModule],
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
