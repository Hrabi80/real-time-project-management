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
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    
    
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req): Promise<any> {
      console.log("Logged in user:", req.user);
      return await this.authService.generateToken(req.user);
    }


    

    @UseGuards(JwtAuthGuard)
    @Get('user')
    async user(@Request() req): Promise<any> {
      
      return req.user;
    }
}
