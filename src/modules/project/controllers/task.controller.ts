import { Body, Controller, HttpCode, Post, UseGuards, Request, HttpStatus, Put, Param, ParseIntPipe, Get, Delete } from "@nestjs/common";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../../modules/auth/guards/jwt-auth.guard";
import { TaskService } from "../services/task.service";
import { Task } from "../entities/task.entity";
import { CreateTaskDto } from "../dtos/create-task.dto";
import { UpdateTaskDto } from "../dtos/update-task.dto";

@ApiTags('Task')
@Controller('task')
@ApiSecurity('bearer')
@UseGuards(JwtAuthGuard)
export class TaskController {
    constructor(private taskService : TaskService){}

    @Post('/')
    @HttpCode(HttpStatus.CREATED)
    @ApiCreatedResponse({
      description: 'Task successfully created',
      type: Task,
    })
    @ApiBadRequestResponse({ description: 'A problem occurred when creating the task. Try again!' })
    async createTask(
      @Body() createTaskDto: CreateTaskDto,
      @ Request() req,
    ): Promise<Task> {
      const manager = req.user;
      return await this.taskService.createTask(createTaskDto, manager);
    }

        // Endpoint to assign a user to a task
    @Put('/:taskId/assign-user/:userId')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        description: 'User successfully assigned to the task',
        type: Task,
    })
    @ApiBadRequestResponse({ description: 'A problem occurred when assigning the user to the task. Try again!' })
    async assignUserToTask(
        @Param('taskId', ParseIntPipe) taskId: number,
        @Param('userId', ParseIntPipe) userId: number,
        @Request() req,
    ): Promise<Task> {
        const manager = req.user; 
        return await this.taskService.assignUserToTask(taskId, userId, manager);
    }


    @Get('/all/:projectId')
    @ApiOkResponse({
        description: 'List of tasks for the specified project',
        type: [Task],
    })
    async getAllTasksByProject(
        @Param('projectId', ParseIntPipe) projectId: number,
    ): Promise<Task[]> {
        return await this.taskService.getAllTasksByProject(projectId);
    }

    // Endpoint to get all tasks by user
    @Get('/user/:userId')
    @ApiOkResponse({
    description: 'List of tasks assigned to the specified user',
    type: [Task],
    })
    async getAllTasksByUser(
    @Param('userId', ParseIntPipe) userId: number): Promise<Task[]> {
    return await this.taskService.getAllTasksByAssignedUser(userId);
    }

     // Endpoint to update a task
    @Put('/:taskId')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        description: 'Task successfully updated',
        type: Task,
    })
    @ApiBadRequestResponse({ description: 'A problem occurred when updating the task. Try again!' })
    async updateTask(
        @Param('taskId', ParseIntPipe) taskId: number,
        @Body() updateTaskDto: UpdateTaskDto,
        @Request() req,
    ): Promise<Task> {
        const user = req.user; // Get the authenticated user (either manager or assigned member)
        return await this.taskService.updateTask(taskId, updateTaskDto, user);
    }

    @Delete('/:taskId')
    @HttpCode(HttpStatus.NO_CONTENT) // Return 204 No Content on success
    @ApiOkResponse({
        description: 'Task successfully deleted',
    })
    @ApiBadRequestResponse({ description: 'A problem occurred when deleting the task. Try again!' })
    async deleteTask(
        @Param('taskId', ParseIntPipe) taskId: number,
        @Request() req,
    ): Promise<void> {
        const user = req.user; // Get the authenticated user (either manager or assigned member)
        await this.taskService.deleteTask(taskId, user);
    }


}