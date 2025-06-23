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

  private usersConnected: Record<
    string,
    {
      id: number
      username: string
      email: string
      status_id: number
      firstname: string
      lastname: string
      birthdate: string
      phone_number: string
    }
  > = {}

  public getUserConnectedData(token: string) {
    return this.usersConnected[token]
  }

  private createToken() {
    const chars =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$&'
    let token = ''
    const charsLength = chars.length
    const max = 50

    for (let i = 0; i < max; i++) {
      if (i > 5 && i % 4 === 0 && i < max - 2) token += '-'
      else {
        const randomCharIndex = Math.floor(Math.random() * charsLength)
        token += chars.charAt(randomCharIndex)
      }
    }
    const existsToken =
      Object.keys(this.usersConnected).includes(token) ||
      this.blackListedToken.includes(token)
        ? true
        : false
    if (existsToken) this.createToken()
    else return token
  }

  private verifyConnection(username: string) {
    const tokensList = Object.keys(this.usersConnected)
    return tokensList
      .map((token) => {
        return username === this.usersConnected[token].username ? true : false
      })
      .filter(Boolean).length > 0
      ? true
      : false
  }

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
    if (this.verifyConnection(username)) {
      HttpResponse({ data: 'usuario ya conectado', status: 401 })
    }
    // NOTE: AuthService: aqui podriamos tambien poner alguna logica
    // para verificar que el usuario ya este conectado antes de enviar el token
    const token = this.createToken()
    const payload = await this.userService.findOne({
      username,
    })
    this.usersConnected[token] = payload.data
    return {
      data: token,
      status: 200,
    }
  }

  @TryCatch()
  async logout(token: string) {
    if (!token) HttpResponse({ data: 'token no encontrado', status: 404 })
    const is_registry =
      this.usersConnected[token] && !this.blackListedToken.includes(token)
    if (!is_registry) {
      HttpResponse({ data: 'No se puede efectuar esta accion', status: 401 })
    }
    delete this.usersConnected[token]
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
