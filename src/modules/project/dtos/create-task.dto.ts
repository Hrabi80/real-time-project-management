import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { TaskStates } from "../enums/status.enum";


export class CreateTaskDto {
 

    @ApiProperty({ 
        description: 'Title of the task', 
        example: 'Design UI' 
    })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({ 
        description: 'Description of the task', 
        example: 'Design the user interface for the main dashboard' 
    })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({ 
        description: 'State of the task', 
        enum: TaskStates, 
        example: TaskStates.IN_PROGRESS 
    })
    @IsNotEmpty()
    @IsEnum(TaskStates)
    state: TaskStates;

    @ApiProperty({ 
        description: 'The deadline for the task', 
        example: '2024-09-30' 
    })
    @IsNotEmpty()
    @IsDate()
    deadline: Date;

    @ApiProperty({ 
        description: 'The date when the user was assigned to the task', 
        example: '2024-08-30' 
    })
    @IsOptional()
    @IsDate()
    assignedDate?: Date;

    @ApiProperty({ 
        description: 'The project ID this task belongs to', 
        example: 1 
    })
    @IsOptional()
    projectId?: number;

    @ApiProperty({ 
        description: 'The member IDs this task is assigned to', 
        example: [2, 3] 
    })
    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    memberIds?: number[];
    @ApiProperty({ 
        description: 'When the task was created' 
    })
    @IsOptional()
    createdAt?: Date;

    @ApiProperty({ 
        description: 'When the task was updated' 
    })
    @IsOptional()
    updatedAt?: Date;
}
