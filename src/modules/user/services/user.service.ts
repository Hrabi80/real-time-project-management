import { Injectable } from "@nestjs/common";
import { UserRegisterRequestDto } from "../dtos/user-register.req.dto";
import { User } from "../entities/user.entity";

@Injectable()
export class UserService{
    
    async register(userRegister: UserRegisterRequestDto): Promise<User> {
        const user = new User();
        user.name = userRegister.name;
        user.email = userRegister.email;
        user.password = userRegister.password;
        return await user.save();
  }
}   