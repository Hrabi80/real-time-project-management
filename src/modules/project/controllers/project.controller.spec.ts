import { Test, TestingModule } from '@nestjs/testing';
import { ProjectController } from './project.controller';
import { ProjectService } from '../services/project.service';
import { UserService } from '../../../modules/user/services/user.service';
import { createProjectDto } from '../dtos/create-project.dto';
import { updateProjectDto } from '../dtos/update-project.dto';
import { Project } from '../entities/project.entity';
import { ManagerRoleGuard } from '../../../modules/auth/guards/manager-role.guard';
import { JwtAuthGuard } from '../../../modules/auth/guards/jwt-auth.guard';
import { BadRequestException, INestApplication, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { testOrmConfig } from 'src/config/typeorm.config';
import { ProjectModule } from '../project.module';
import * as request from 'supertest';
let app: INestApplication;
let projectRepository: Repository<Project>;

beforeAll(async () => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot(testOrmConfig),
      ProjectModule,
    ],
  }).compile();

  app = module.createNestApplication();
  await app.init();

  projectRepository = module.get<Repository<Project>>(getRepositoryToken(Project));
});
describe('ProjectController', () => {
  let controller: ProjectController;
  let service: ProjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [
        {
          provide: ProjectService,
          useValue: {
            getProjectById: jest.fn(),
            createNewProject: jest.fn(),
            updateProject: jest.fn(),
            getAllProjects: jest.fn(),
            getAllProjectsByManager: jest.fn(),
            deleteProject: jest.fn(),
          },
        },
        {
          provide: UserService, // Mock the UserService
          useValue: {
            getUserById: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) }) // Mock JwtAuthGuard
      .overrideGuard(ManagerRoleGuard)
      .useValue({ canActivate: jest.fn(() => true) }) // Mock ManagerRoleGuard
      .compile();

    controller = module.get<ProjectController>(ProjectController);
    service = module.get<ProjectService>(ProjectService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProjectById', () => {
    it('should return a project by ID', async () => {
      const project: Project = { id: 1, name: 'Test Project' } as Project;
      jest.spyOn(service, 'getProjectById').mockResolvedValue(project);

      expect(await controller.getProjectById(1)).toBe(project);
    });

    it('should throw NotFoundException if the project is not found', async () => {
      jest.spyOn(service, 'getProjectById').mockResolvedValue(null);

      await expect(controller.getProjectById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createProject', () => {
    it('should create a new project', async () => {
      const manager = { id: 1 };
      const projectDto: createProjectDto = { name: 'New Project', description: 'Description', startDate: new Date() };
      const project: Project = { id: 1, ...projectDto } as Project;

      jest.spyOn(service, 'createNewProject').mockResolvedValue(project);

      expect(await controller.createProject(projectDto, { user: manager })).toBe(project);
      expect(service.createNewProject).toHaveBeenCalledWith(projectDto, manager);
    });

    it('should throw BadRequestException if the creation fails', async () => {
      const manager = { id: 1 };
      const projectDto: createProjectDto = { name: 'New Project', description: 'Description', startDate: new Date() };

      jest.spyOn(service, 'createNewProject').mockImplementation(() => {
        throw new BadRequestException('A problem occurs when creating a project. Try again!');
      });

      await expect(controller.createProject(projectDto, { user: manager })).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateProject', () => {
    it('should update a project', async () => {
      const manager = { id: 1 };
      const projectDto: updateProjectDto = { name: 'Updated Project' };
      const project: Project = { id: 1, ...projectDto } as Project;

      jest.spyOn(service, 'updateProject').mockResolvedValue(project);

      expect(await controller.updateProject(1, projectDto, { user: manager })).toBe(project);
      expect(service.updateProject).toHaveBeenCalledWith(1, projectDto, manager);
    });

    it('should throw UnauthorizedException if the manager is not the owner', async () => {
      const manager = { id: 1 };
      const projectDto: updateProjectDto = { name: 'Updated Project' };

      jest.spyOn(service, 'updateProject').mockImplementation(() => {
        throw new UnauthorizedException('You do not have permission to update this project');
      });

      await expect(controller.updateProject(1, projectDto, { user: manager })).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getAllProjects', () => {
    it('should return a list of all projects', async () => {
      const projects: Project[] = [{ id: 1, name: 'Project 1' }] as Project[];
      jest.spyOn(service, 'getAllProjects').mockResolvedValue(projects);

      expect(await controller.getAllProjects()).toBe(projects);
    });
  });

  describe('getAllProjectsByManager', () => {
    it('should return a list of projects by manager', async () => {
      const manager = { id: 1 };
      const projects: Project[] = [{ id: 1, name: 'Project 1' }] as Project[];
      jest.spyOn(service, 'getAllProjectsByManager').mockResolvedValue(projects);

      expect(await controller.getAllProjectsByManager({ user: manager })).toBe(projects);
      expect(service.getAllProjectsByManager).toHaveBeenCalledWith(manager);
    });

    it('should throw BadRequestException if manager ID is invalid', async () => {
      const manager = { id: 'invalid' }; // non-numeric ID

      await expect(controller.getAllProjectsByManager({ user: manager })).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteProject', () => {
    it('should delete a project', async () => {
      const manager = { id: 1 };

      jest.spyOn(service, 'deleteProject').mockResolvedValue(undefined);

      await controller.deleteProject(1, { user: manager });

      expect(service.deleteProject).toHaveBeenCalledWith(1, manager);
    });

    it('should throw NotFoundException if the project does not exist', async () => {
      const manager = { id: 1 };

      jest.spyOn(service, 'deleteProject').mockImplementation(() => {
        throw new NotFoundException('Project not found');
      });

      await expect(controller.deleteProject(1, { user: manager })).rejects.toThrow(NotFoundException);
    });
  });

  afterEach(async () => {
    await projectRepository.clear(); // Clear the project repository after each test
  });

  afterAll(async () => {
    await app.close(); // Close the application after all tests are done
  });

  it('should create a project', async () => {
    const createProjectDto = {
      name: 'Test Project',
      description: 'A project for testing purposes',
      startDate: '2024-01-01',
    };

    const response = await request(app.getHttpServer())
      .post('/project')
      .send(createProjectDto)
      .expect(201);

    expect(response.body.name).toBe(createProjectDto.name);
    expect(response.body.description).toBe(createProjectDto.description);
  });

  
});
