import { JwtService } from '@nestjs/jwt'
import { UserService } from '../user/user.service'
import { Injectable } from '@nestjs/common'
import { TryCatch } from 'src/decorators/core.decoratos'
import HttpResponse from 'src/utils/exceptios'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  private blackListedToken: string[] = []

  @TryCatch()
  async signin(opt: { username: string; password: string }) {
    const { username, password } = opt
    const credentials = await this.userService.findUserCredentials({
      username,
      email: username,
    })
    // NOTE: AuthService: mensaje de error credenciales invalidas
    if (!credentials)
      HttpResponse({ data: 'credenciales invalidas', status: 401 })

    if (credentials.status_id === 2)
      HttpResponse({ data: 'usuario bloqueado', status: 401 })

    if (credentials.password !== password) {
      const counterAccess = await this.userService.updateLimitAccess(username)
      if (counterAccess > 2)
        await this.userService.blockAndUnblock(credentials.id)

      HttpResponse({
        data: `credenciales invalidas, numero de intentos fallidos ${counterAccess}`,
        status: 401,
      })
    }

    // NOTE: AuthService: aqui podriamos tambien poner alguna logica
    // para verificar que el usuario ya este conectado antes de enviar el token

    const payload = await this.userService.findOne({
      username,
    })

    return {
      data: await this.jwtService.signAsync(payload),
      status: 200,
    }
  }

  async verifyToken(token: string) {
    let existsToken = false
    let decodedToken: any
    let response: {
      verified: boolean
      decoded?: Record<string, any>
    } = {
      verified: false,
    }
    const no_in_black_list =
      this.blackListedToken.filter((blt) => blt === token).length > 0
    try {
      await this.jwtService.verifyAsync(token)
      existsToken = true
      decodedToken = await this.jwtService.decode(token)
      response.decoded = decodedToken
    } catch (_e) {
      existsToken = false
    }
    response = {
      verified:
        (!existsToken && no_in_black_list) || (existsToken && no_in_black_list),
    }
    return response
  }

  @TryCatch()
  async logout(token: string) {
    if (!token) HttpResponse({ data: 'token no encontrado', status: 404 })
    const is_registry = await this.verifyToken(token)
    if (is_registry.verified) {
      HttpResponse({ data: 'No se puede efectuar esta accion', status: 401 })
    }
    this.blackListedToken.push(token)
    setTimeout(() => {
      this.blackListedToken = this.blackListedToken.filter(
        (blt) => blt !== token,
      )
    }, 1000 * 3600)
    return {
      data: 'Tu sesión se ha cerrado exitosamente.',
      status: 200,
    }
  }
}
