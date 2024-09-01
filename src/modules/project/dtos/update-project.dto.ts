import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class updateProjectDto{

    @Length(3,255)
    @IsString()
    name?: string;

    @ApiProperty({ 
        description: 'Update Description of the project', 
        example: 'The ERP project is for the client x lorem epsilom ....' 
    })

    @IsString()
    @Length(8)
    description?: string;

    @ApiProperty({ 
        description: 'Update The start date of the project', 
        example: '2024-01-01' 
    })

    @IsDate()
    @Type(() => Date)
    startDate?: Date;

    @ApiProperty({ 
        description: 'The end date of the project', 
        example: '2024-12-31' 
    })


    @IsDate()
    @Type(() => Date)
    endDate?: Date;
}