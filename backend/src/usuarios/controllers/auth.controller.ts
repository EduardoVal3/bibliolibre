import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { RefreshDto } from '../dto/refresh.dto';
import { RegistroDto } from '../dto/registro.dto';
import { CambiarPasswordDto } from '../dto/cambiar-password.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password, returns JWT tokens' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token using refresh token (validates and rotates)' })
  refresh(@Body() refreshDto: RefreshDto) {
    return this.authService.refresh(refreshDto.refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revoke the current refresh token (logout)' })
  logout(@Body() refreshDto: RefreshDto, @Req() req: any) {
    return this.authService.logout(refreshDto.refreshToken, req.user);
  }

  @Post('registro')
  @ApiOperation({ summary: 'Register a new user (public)' })
  registro(@Body() registroDto: RegistroDto) {
    return this.authService.registro(registroDto);
  }

  @Post('cambiar-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change password (authenticated, supports both usuarios and empleados)' })
  cambiarPassword(@Body() dto: CambiarPasswordDto, @Req() req: any) {
    return this.authService.cambiarPassword(req.user, dto);
  }
}
