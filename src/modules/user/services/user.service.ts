import { Injectable } from "@nestjs/common";
import { UserRegisterRequestDto } from "../dtos/user-register.req.dto";
import { User } from "../entities/user.entity";
import { UserRoles } from "../enums/user.enum";

@Injectable()
export class UserService{
    
  async register(userRegister: UserRegisterRequestDto): Promise<User> {
        const user = new User();
        user.name = userRegister.name;
        user.email = userRegister.email;
        user.password = userRegister.password;
        return await user.save();
  }
  async registerManager(userRegister: UserRegisterRequestDto): Promise<User> {
    const user = new User();
    user.name = userRegister.name;
    user.email = userRegister.email;
    user.password = userRegister.password;
    user.role = UserRoles.MANAGER;
    return await user.save();
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return User.findOne({ where: { email } });
  }

  async getUserById(id: number): Promise<User | undefined> {
    return User.findOne({ where: { id } });
  }
}   