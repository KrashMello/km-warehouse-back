import { JwtService } from '@nestjs/jwt'
import { UserService } from '../user/user.service'
import { Injectable } from '@nestjs/common'
import { TryCatch } from 'src/decorators/core.decoratos'
import * as HttpResponse from 'src/utils/exceptios'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  @TryCatch()
  async signin(opt: { username: string; password: string }) {
    const { username, password } = opt
    const credentials = await this.userService.findUserCredentials({
      username,
      email: username,
    })
    const response = { data: '' }
    // NOTE: AuthService: mensaje de error credenciales invalidas
    if (!credentials)
      HttpResponse.Unauthorized({ data: 'credenciales invalidas' })

    if (credentials.status_id === 2)
      HttpResponse.Unauthorized({ data: 'usuario bloqueado' })

    if (credentials.password !== password) {
      const counterAccess = await this.userService.updateLimitAccess(username)
      if (counterAccess > 2)
        await this.userService.blockAndUnblock(credentials.id)

      HttpResponse.Unauthorized({
        data: `credenciales invalidas, numero de intentos fallidos ${counterAccess}`,
      })
    }

    // NOTE: AuthService: aqui podriamos tambien poner alguna logica
    // para verificar que el usuario ya este conectado antes de enviar el token

    const payload = await this.userService.findOne({
      username,
    })

    response.data = await this.jwtService.signAsync(payload)

    return HttpResponse.Ok(response)
  }
}
