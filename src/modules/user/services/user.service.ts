import { BadRequestException, Injectable } from "@nestjs/common";
import { UserRegisterRequestDto } from "../dtos/user-register.req.dto";
import { User } from "../entities/user.entity";
import { UserRoles } from "../enums/user.enum";
import { Manager } from "../entities/manager.entity";

@Injectable()
export class UserService{
 
  
  async register(userRegister: UserRegisterRequestDto): Promise<User> {
    // Check if the email is already registered
    const existingEmailManager = await Manager.findOne({ where: { email: userRegister.email } });
    const existingEmailMemeber = await User.findOne({ where: { email: userRegister.email } });
    if (existingEmailManager || existingEmailMemeber) {
      throw new BadRequestException('User with this email already exists');
    }
    const user = new User();
    user.name = userRegister.name;
    user.email = userRegister.email;
    user.password = userRegister.password;
    return await user.save();
  }


  async registerManager(userRegister: UserRegisterRequestDto): Promise<Manager> {
    // Check if the email is already registered
    const existingEmailManager = await Manager.findOne({ where: { email: userRegister.email } });
    const existingEmailMemeber = await User.findOne({ where: { email: userRegister.email } });
    if (existingEmailManager || existingEmailMemeber) {
      throw new BadRequestException('User with this email already exists');
    }
    else{
      const manager = new Manager();
      manager.name = userRegister.name;
      manager.email = userRegister.email;
      manager.password = userRegister.password;
      manager.role = UserRoles.MANAGER;
      return await manager.save();
    }
    
  }

  async getUserByEmail(email: string): Promise<User | Manager |undefined > {

    const user = await User.findOne({ where: { email } });
  
    if (user) {
      return user;
    }
    const manager = await Manager.findOne({ where: { email } });
    if (manager) {
      return manager;
    }
    return undefined;
  }

 

  async getUserById(id: number): Promise<User | undefined> {
    return User.findOne({ where: { id } }) ;
  }

  async getManagerById(id: number): Promise<User | undefined> {
    return Manager.findOne({ where: { id } });
  }

}   