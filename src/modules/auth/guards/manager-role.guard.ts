import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserRoles } from '../../user/enums/user.enum';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class ManagerRoleGuard implements CanActivate {
  constructor(private userService: UserService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest(); //get the user context 
      
    if (request?.user) { 
      console.log("User context in guard:", request.user);  
      console.log("user context here =============>",request.user);
      const { id } = request.user;  
      const user = await this.userService.getUserById(id); //get User object byId
      console.log("user email here =============>",user.email);
      return user.role === UserRoles.MANAGER;
    }

    return false;
  }
}