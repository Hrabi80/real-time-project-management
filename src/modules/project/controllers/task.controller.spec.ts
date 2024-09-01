import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from '../services/task.service';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { UpdateTaskDto } from '../dtos/update-task.dto';
import { Task } from '../entities/task.entity';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { TaskStates } from '../enums/status.enum';

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: {
            createTask: jest.fn(),
            assignUserToTask: jest.fn(),
            getAllTasksByProject: jest.fn(),
            getAllTasksByAssignedUser: jest.fn(),
            updateTask: jest.fn(),
            deleteTask: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTask', () => {
    it('should create a new task', async () => {
      const manager = { id: 1 };
      const createTaskDto: CreateTaskDto = { title: 'Test Task', description: 'Task description', state:TaskStates.NOT_STARTING, deadline: new Date(), projectId: 1 };
      const task: Task = { id: 1, ...createTaskDto } as Task;

      jest.spyOn(service, 'createTask').mockResolvedValue(task);

      expect(await controller.createTask(createTaskDto, { user: manager })).toBe(task);
      expect(service.createTask).toHaveBeenCalledWith(createTaskDto, manager);
    });

    it('should throw BadRequestException if task creation fails', async () => {
      const manager = { id: 1 };
      const createTaskDto: CreateTaskDto = { title: 'Test Task', description: 'Task description', state: TaskStates.NOT_STARTING, deadline: new Date(), projectId: 1 };

      jest.spyOn(service, 'createTask').mockImplementation(() => {
        throw new BadRequestException('A problem occurred when creating the task. Try again!');
      });

      await expect(controller.createTask(createTaskDto, { user: manager })).rejects.toThrow(BadRequestException);
    });
  });

  describe('assignUserToTask', () => {
    it('should assign a user to a task', async () => {
      const manager = { id: 1 };
      const task: Task = { id: 1, title: 'Test Task' } as Task;

      jest.spyOn(service, 'assignUserToTask').mockResolvedValue(task);

      expect(await controller.assignUserToTask(1, 2, { user: manager })).toBe(task);
      expect(service.assignUserToTask).toHaveBeenCalledWith(1, 2, manager);
    });

    it('should throw BadRequestException if user assignment fails', async () => {
      const manager = { id: 1 };

      jest.spyOn(service, 'assignUserToTask').mockImplementation(() => {
        throw new BadRequestException('A problem occurred when assigning the user to the task. Try again!');
      });

      await expect(controller.assignUserToTask(1, 2, { user: manager })).rejects.toThrow(BadRequestException);
    });
  });

  describe('getAllTasksByProject', () => {
    it('should return a list of tasks for a project', async () => {
      const tasks: Task[] = [{ id: 1, title: 'Task 1' }] as Task[];
      jest.spyOn(service, 'getAllTasksByProject').mockResolvedValue(tasks);

      expect(await controller.getAllTasksByProject(1)).toBe(tasks);
    });
  });

  describe('getAllTasksByUser', () => {
    it('should return a list of tasks assigned to a user', async () => {
      const tasks: Task[] = [{ id: 1, title: 'Task 1' }] as Task[];
      jest.spyOn(service, 'getAllTasksByAssignedUser').mockResolvedValue(tasks);

      expect(await controller.getAllTasksByUser(1)).toBe(tasks);
    });
  });

  describe('updateTask', () => {
    it('should update a task', async () => {
      const user = { id: 1 };
      const updateTaskDto: UpdateTaskDto = { title: 'Updated Task' };
      const task: Task = { id: 1, ...updateTaskDto } as Task;

      jest.spyOn(service, 'updateTask').mockResolvedValue(task);

      expect(await controller.updateTask(1, updateTaskDto, { user })).toBe(task);
      expect(service.updateTask).toHaveBeenCalledWith(1, updateTaskDto, user);
    });

    it('should throw UnauthorizedException if the user is not authorized to update the task', async () => {
      const user = { id: 1 };
      const updateTaskDto: UpdateTaskDto = { title: 'Updated Task' };

      jest.spyOn(service, 'updateTask').mockImplementation(() => {
        throw new UnauthorizedException('You do not have permission to update this task');
      });

      await expect(controller.updateTask(1, updateTaskDto, { user })).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      const user = { id: 1 };

      jest.spyOn(service, 'deleteTask').mockResolvedValue(undefined);

      await controller.deleteTask(1, { user });

      expect(service.deleteTask).toHaveBeenCalledWith(1, user);
    });

    it('should throw NotFoundException if the task does not exist', async () => {
      const user = { id: 1 };

      jest.spyOn(service, 'deleteTask').mockImplementation(() => {
        throw new NotFoundException('Task not found');
      });

      await expect(controller.deleteTask(1, { user })).rejects.toThrow(NotFoundException);
    });
  });
});
