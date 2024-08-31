import {
    Body,
    Controller,
    Get,
    Post,
    Request,
    UseGuards,
  } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../Dtos/login.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login( @Body() loginDto: LoginDto): Promise<any> {
      return await this.authService.generateToken(loginDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('user')
    async user(@Request() req): Promise<any> {
      
      return req.user;
    }
}
