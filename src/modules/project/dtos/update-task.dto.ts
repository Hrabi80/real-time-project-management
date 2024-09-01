import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { TaskStates } from "../enums/status.enum";

export class UpdateTaskDto {

  @ApiProperty({ 
      description: 'Title of the task', 
      example: 'Design UI',
      required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ 
      description: 'Description of the task', 
      example: 'Design the user interface for the main dashboard',
      required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
      description: 'State of the task', 
      enum: TaskStates,
      example: TaskStates.IN_PROGRESS,
      required: false,
  })
  @IsOptional()
  @IsEnum(TaskStates)
  state?: TaskStates;
}
