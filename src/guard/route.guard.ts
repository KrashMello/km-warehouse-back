import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
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
    const token = context.switchToHttp().getRequest().headers[
      'km-authentication'
    ]
    if (isPublic) {
      return true
    } else {
      const verifyToken = await this.auth.verifyToken(token)
      if (!verifyToken.verified)
        HttpResponse({ data: 'RECURSO PROHIBIDO', status: 403 })
      return true
    }
  }
}
