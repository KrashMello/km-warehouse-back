import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Module, Permission } from 'src/decorators/core.decoratos'
import { AuthService } from 'src/system/auth/auth.service'
import HttpResponse from 'src/utils/exceptios'

@Injectable()
export class RouteGuard implements CanActivate {
  constructor(
    private readonly auth: AuthService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get('isPublic', context.getHandler())
    if (isPublic) {
      return true
    } else {
      const permission = this.reflector.get(Permission, context.getHandler())
      const module = this.reflector.get(Module, context.getHandler())
      const token = context.switchToHttp().getRequest().headers[
        'km-authentication'
      ]
      const userConected = this.auth.getUserConnectedData(token)
      if (!userConected) HttpResponse({ data: 'TOKEN INVALIDO', status: 403 })
      return true
    }
  }
}
