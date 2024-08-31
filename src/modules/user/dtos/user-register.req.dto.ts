import { IsEmail, IsNotEmpty, Length, Matches } from "class-validator";
import { REGEX,MESSAGES } from "src/utils/app.utils";

export class UserRegisterRequestDto{
    @IsNotEmpty()
    name:string;
    @IsNotEmpty()
    @IsEmail()
    email:string;
    @IsNotEmpty()
    @Length(6,24)
    @Matches(REGEX.PASSWORD_RULE, { message: MESSAGES.PASSWORD_RULE_MESSAGE })
    password: string;
    @IsNotEmpty()
    @Length(6,24)
    @Matches(REGEX.PASSWORD_RULE, { message: MESSAGES.PASSWORD_RULE_MESSAGE })
    confirm :string;
}