import { Body, Controller, Post, Request, Version } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { SigninBodyDto } from './dto/singinBody.dto'
import HttpResponse from 'src/utils/exceptios'
import { Public } from 'src/decorators/core.decoratos'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @Version('1')
  @Public()
  async signin(@Body() body: SigninBodyDto) {
    HttpResponse(await this.authService.signin(body))
  }

  @Post('logout')
  @Version('1')
  async logout(@Request() req: Request) {
    HttpResponse(
      await this.authService.logout(req.headers['km-authentication']),
    )
  }
}
