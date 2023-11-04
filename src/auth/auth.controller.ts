import {
  Controller,
  Post,
  Body,
  Delete,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, LocalAuthGuard } from 'src/common/guards';
import { docAuthService } from 'src/common/swagger/auth.swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @docAuthService.login('Login user')
  @Post('login')
  login(@Req() req, @Body() body: LoginDto) {
    return this.authService.login(req);
  }

  @ApiBearerAuth()
  @docAuthService.logout('Logout user')
  @UseGuards(JwtAuthGuard)
  @Delete('logout')
  logout(@Req() req) {
    return this.authService.logout(req);
  }

  @ApiBearerAuth()
  @docAuthService.resetPassword('Reset password user')
  @Patch('reset-password')
  resetPassword() {
    return this.authService.resetPassword();
  }
}
