import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, Length, Matches } from "class-validator";
import { REGEX,MESSAGES } from "src/utils/app.utils";
import { UserRoles } from "../enums/user.enum";

export class UserRegisterRequestDto{
    @ApiProperty({
        description: 'The name of the User',
        example: 'Ahmed Hrabi',
      })
    @IsNotEmpty()
    name:string;

    @ApiProperty({
        description: 'The email address of the User',
        example: 'hrabi.ahmed888@gmail.com',
      })
    @IsNotEmpty()
    @IsEmail()
    email:string;

    @ApiProperty({
        description: 'The password of the User',
        example: 'Password@123',
      })
    @IsNotEmpty()
    @Length(6,24)
    @Matches(REGEX.PASSWORD_RULE, { message: MESSAGES.PASSWORD_RULE_MESSAGE })
    password: string;

    @ApiProperty({
        description: 'Confirm the password',
        example: 'Password@123',
      })
    @IsNotEmpty()
    @Length(6,24)
    @Matches(REGEX.PASSWORD_RULE, { message: MESSAGES.PASSWORD_RULE_MESSAGE })
    confirm :string;

    @ApiProperty({
        description: 'The role of the User',
        example: 'admin',
      })
    role?:UserRoles;
}