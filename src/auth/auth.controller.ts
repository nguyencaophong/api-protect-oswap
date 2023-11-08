import {
  Controller,
  Post,
  Body,
  Delete,
  Patch,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, ResetPasswordDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, LocalAuthGuard } from 'src/common/guards';
import { docAuthService } from 'src/common/swagger/auth.swagger';
import { ParseUsernamePipe } from 'src/common/pipes';
import { Throttle } from '@nestjs/throttler';
import { throttlerOptions } from 'src/common/constants';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Throttle(throttlerOptions['short'])
  @UseGuards(LocalAuthGuard)
  @docAuthService.login('Login user')
  @Post('login')
  login(@Req() req, @Body() body: LoginDto) {
    return this.authService.login(req);
  }

  @docAuthService.logout('Logout user')
  @UseGuards(JwtAuthGuard)
  @Delete('logout')
  logout(@Req() req) {
    return this.authService.logout(req);
  }

  @docAuthService.resetPassword('Reset password user')
  @Patch('reset-password/:username')
  resetPassword(
    @Param('username', ParseUsernamePipe) username: string,
    @Body() body: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(username, body);
  }
}
