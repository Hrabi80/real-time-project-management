import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import appConfig from '../../../config/app.config';
import { UnauthorizedException } from '@nestjs/common';
import { User } from 'src/modules/user/entities/user.entity';

export class JwtStrategy extends PassportStrategy(Strategy) {
  userService: any;
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: appConfig().appSecret,
      
    });
    console.log('JwtStrategy initialized'); 
  }


  async validate(payload: any) {
    return {
      id: payload.sub,
      name: payload.name,
      tenant: 'amitav',
      role: payload.role,
    };
  }
}