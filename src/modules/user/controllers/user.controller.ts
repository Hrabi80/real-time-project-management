import { Body, Controller, HttpStatus, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from "../services/user.service";
import { UserRegisterRequestDto } from "../dtos/user-register.req.dto";
import { SETTINGS } from "src/utils/app.utils";

@Controller('user')
export class UserController{

    constructor(private readonly userService : UserService){

    }
    @Post('/register')
    @UsePipes(new ValidationPipe({errorHttpStatusCode:HttpStatus.UNPROCESSABLE_ENTITY }))
    async registration(@Body(SETTINGS.VALIDATION_PIPE) userRegister : UserRegisterRequestDto){
        return await this.userService.register(userRegister);
    }
}   