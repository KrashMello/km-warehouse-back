import { Module } from '@nestjs/common'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { APP_GUARD } from '@nestjs/core'
import { RouteGuard } from 'src/guard/route.guard'
import { StatusModule } from './status/status.module'
import { RolesModule } from './roles/roles.module'

@Module({
  imports: [UserModule, AuthModule, StatusModule, RolesModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RouteGuard,
    },
  ],
})
export class SystemModule {}
