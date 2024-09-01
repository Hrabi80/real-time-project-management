import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from '../../config/jwt.config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  providers: [AuthService,
              LocalStrategy,
              JwtStrategy
            ],
  controllers: [AuthController],
  imports:[PassportModule,
           JwtModule.registerAsync(jwtConfig),
           UserModule
          ],
  exports:[]
})
export class AuthModule {}
