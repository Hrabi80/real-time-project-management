import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import appConfig from '../../../config/app.config';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: appConfig().appSecret,
      
    });
    console.log('JwtStrategy initialized'); 
  }

  async validate(payload: any) {
    console.log('JWT payload:', payload);
    return {
      id: payload.sub,
      name: payload.name,
      tenant: 'amitav', 
    };
  }
}