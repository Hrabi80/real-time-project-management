import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { ProjectService } from './project.service';
import { UserService } from '../../../modules/user/services/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RealTimeProjectGateway } from '../../../modules/gateway/real-time-project-gateway';
import { NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { User } from '../../../modules/user/entities/user.entity';
import { Project } from '../entities/project.entity';

describe('TaskService', () => {
  let service: TaskService;
  let taskRepository: Repository<Task>;
  let projectRepository: Repository<Project>;
  let projectService: ProjectService;
  let userService: UserService;
  let realTimeGateway: RealTimeProjectGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        ProjectService,
        UserService,
        {
          provide: getRepositoryToken(Task),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Project),
          useClass: Repository,
        },
        {
          provide: RealTimeProjectGateway,
          useValue: {
            broadcastTaskUpdate: jest.fn(),
            SendUpdatedTaskToAssignedUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
    projectRepository = module.get<Repository<Project>>(getRepositoryToken(Project));
    projectService = module.get<ProjectService>(ProjectService);
    userService = module.get<UserService>(UserService);
    realTimeGateway = module.get<RealTimeProjectGateway>(RealTimeProjectGateway);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Additional test cases here...
});
