import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
  } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
  import * as bcrypt from 'bcrypt';
import { UserService } from '../../../modules/user/services/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUserCreds(email: string, password: string): Promise<any> {
    
    const user = await this.userService.getUserByEmail(email);
    console.log("user in validateUser Cred ==>",user);
    if (!user) throw new NotFoundException();

    if (!(await bcrypt.compare(password, user.password)))
      throw new UnauthorizedException();

    return user;
  }

  generateToken(user: any) {
    return {
      access_token: this.jwtService.sign({
        name: user.name,
        sub: user.id,
        role:user.role
      }),
    };
  }

}
