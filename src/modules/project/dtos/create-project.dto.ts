import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class createProjectDto{

    @Length(3,255)
    @IsString()
    @IsNotEmpty({message:"project should have a name"})
    name: string;

    @ApiProperty({ 
        description: 'Description of the project', 
        example: 'The ERP project is for the client x lorem epsilom ....' 
    })
    @IsNotEmpty()
    @IsString()
    @Length(8)
    description: string;

    @ApiProperty({ 
        description: 'The start date of the project', 
        example: '2024-01-01' 
    })
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    startDate: Date;

    @ApiProperty({ 
        description: 'The end date of the project', 
        example: '2024-12-31' 
    })

    
    @IsOptional() /* sometimes the deadline can be unknown*/ 
    @IsDate()
    @Type(() => Date)
    endDate?: Date;
}