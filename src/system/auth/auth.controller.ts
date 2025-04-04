import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SigninBodyDto } from './dto/singinBody.dto';
import HttpResponse from 'src/utils/exceptios'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signin(@Body() body: SigninBodyDto) {
    await this.authService.signin(body).then(response => HttpResponse(response));
  }
}
