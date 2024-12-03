import { Public } from 'src/decorators/public.decorator';
import { AuthService } from './auth.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signin')
  signIn(@Body() body: any) {
    return this.authService.signIn(body.username, body.password);
  }
}
