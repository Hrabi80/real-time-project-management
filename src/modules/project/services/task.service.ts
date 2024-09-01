import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "../entities/task.entity";
import { Repository } from "typeorm";
import { ProjectService } from "./project.service";
import { CreateTaskDto } from "../dtos/create-task.dto";
import { User } from "../../../modules/user/entities/user.entity";
import { UserService } from "../../../modules/user/services/user.service";
import { TaskStates } from "../enums/status.enum";
import { UpdateTaskDto } from "../dtos/update-task.dto";
import { RealTimeProjectGateway } from "../../../modules/gateway/real-time-project-gateway";
@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>,
        private readonly projectService: ProjectService,
        private readonly userService: UserService,
        private readonly realTimeGateway: RealTimeProjectGateway, 
      ) {}

    
  async createTask(taskData: CreateTaskDto, manager: User): Promise<Task> {
    // Ensure the project exists
    const project = await this.projectService.getProjectById(taskData.projectId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Ensure the manager is the owner of the project
    if (project.manager.id !== manager.id) {
      throw new UnauthorizedException('You do not have permission to add tasks to this project');
    }

        const task = new Task();
        task.title = taskData.title;
        task.description = taskData.description;
        task.state = taskData.state;
        task.createdAt = new Date();
        task.deadline = taskData.deadline;
        task.project = project;
         // Validate that the deadline is after the createdAt date
      if (task.deadline <= task.createdAt) {
        throw new BadRequestException('Deadline must be after the creation date.');
      }
      const savedTask = await this.taskRepository.save(task);

      // Emit real-time update event for task creation
      this.realTimeGateway.broadcastTaskUpdate(project.id);
    
      return savedTask;
  }


  // Method to assign a user to a task
  async assignUserToTask(taskId: number, userId: number, manager: User): Promise<Task> {
    // Ensure the task exists
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['project','project.manager', 'assignedMembers'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }
   
    // Ensure the manager is the owner of the project to which the task belongs
    if (task.project.manager.id !== manager.id) {
      throw new UnauthorizedException('You do not have permission to assign users to tasks in this project');
    }

    // Check if the deadline has passed
    if (task.deadline < new Date()) {
      throw new BadRequestException('Cannot assign a user to a task with a past deadline');
    }

    // Ensure the user exists
    const user = await this.userService.getUserById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    // Check if the user is already assigned to the task
    const isAlreadyAssigned = task.assignedMembers.some(member => member.id === user.id);
    if (isAlreadyAssigned) {
        throw new BadRequestException('This user is already assigned to the task.');
    }

    // Assign the user to the task and set the assignedDate
    task.assignedMembers.push(user);
    task.assignedDate = new Date();

    const updatedTask = await this.taskRepository.save(task);

     // Emit real-time update event for the assigned user
     this.realTimeGateway.SendUpdatedTaskToAssignedUser({ taskId: task.id, userId, managerId: manager.id });

     return updatedTask;
  }

  async getAllTasksByProject(projectId: number): Promise<Task[]> {
    console.log("projectId",projectId)
    const project = await this.projectService.getProjectById(projectId);
  
    if (!project) {
      throw new NotFoundException('Project not found');
    }
  
    return await this.taskRepository.find({
      where: { project: {id : projectId} },
      relations: ['assignedMembers'],
    });
  }

  async getAllTasksByAssignedUser(userId: number): Promise<Task[]> {
    const user = await this.userService.getUserById(userId);
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    return await this.taskRepository.find({
      where: { assignedMembers: { id: userId } },
      relations: ['project'],
    });
  }


  async updateTask(taskId: number, updateTaskDto: UpdateTaskDto, user: User): Promise<Task> {
    // Ensure the task exists and load the project, manager, and assigned members
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['project', 'project.manager', 'assignedMembers'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Ensure the user is either the project manager or an assigned member
    console.log("userId in update Tasl==>",user.id);
    const isAssignedMember = task.assignedMembers.some(member => member.id === user.id);
    const isProjectManager = task.project.manager.id === user.id;

    if (!isAssignedMember && !isProjectManager) {
      throw new UnauthorizedException('You do not have permission to update this task');
    }

    // Update the task fields (title, description, state)
    task.title = updateTaskDto.title || task.title;
    task.description = updateTaskDto.description || task.description;
    task.state = updateTaskDto.state || task.state;

    // Validate that the state is within the enum TaskStates
    if (!Object.values(TaskStates).includes(task.state)) {
      throw new BadRequestException('Invalid task state');
    }
    const updatedTask = await this.taskRepository.save(task);
     this.realTimeGateway.broadcastTaskUpdate(task.project.id);

    return updatedTask;
  }

  async deleteTask(taskId: number, user: User): Promise<void> {
    // Ensure the task exists and load the project, manager, and assigned members
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['project', 'project.manager', 'assignedMembers'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Ensure the user is either the project manager or an assigned member
    const isAssignedMember = task.assignedMembers.some(member => member.id === user.id);
    const isProjectManager = task.project.manager.id === user.id;

    if (!isAssignedMember && !isProjectManager) {
      throw new UnauthorizedException('You do not have permission to delete this task');
    }

    // Delete the task
    await this.taskRepository.remove(task);
  }
  
  


 
}