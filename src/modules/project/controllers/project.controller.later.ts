import { Test, TestingModule } from '@nestjs/testing';
import { ProjectController } from './project.controller';
import { ProjectService } from '../services/project.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ManagerRoleGuard } from '../../auth/guards/manager-role.guard';
import { createProjectDto } from '../dtos/create-project.dto';
import { updateProjectDto } from '../dtos/update-project.dto';
import { Project } from '../entities/project.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('ProjectController', () => {
  let controller: ProjectController;
  let service: ProjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [
        ProjectService,
        {
          provide: getRepositoryToken(Project),
          useClass: Repository,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(ManagerRoleGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<ProjectController>(ProjectController);
    service = module.get<ProjectService>(ProjectService);
  });
  describe('getProjectById', () => {
    it('should return a project by ID', async () => {
      const mockProject = { id: 1, name: 'Test Project' } as Project;
      jest.spyOn(service, 'getProjectById').mockResolvedValue(mockProject);
  
      const result = await controller.getProjectById(1);
      expect(result).toEqual(mockProject);
      expect(service.getProjectById).toHaveBeenCalledWith(1);
    });
  });

  describe('createProject', () => {
    it('should create a new project', async () => {
      const mockProject = { id: 1, name: 'New Project' } as Project;
      const projectDto: createProjectDto = { name: 'New Project', description: 'New Project Description', startDate: new Date() };
      const mockManager = { id: 1, role: 'manager' };
  
      jest.spyOn(service, 'createNewProject').mockResolvedValue(mockProject);
  
      const result = await controller.createProject(projectDto, { user: mockManager });
      expect(result).toEqual(mockProject);
      expect(service.createNewProject).toHaveBeenCalledWith(projectDto, mockManager);
    });
  });

  describe('getAllProjects', () => {
    it('should return an array of projects', async () => {
      const mockProjects = [{ id: 1, name: 'Project 1' }, { id: 2, name: 'Project 2' }] as Project[];
      jest.spyOn(service, 'getAllProjects').mockResolvedValue(mockProjects);
  
      const result = await controller.getAllProjects();
      expect(result).toEqual(mockProjects);
      expect(service.getAllProjects).toHaveBeenCalled();
    });
  });

  describe('getAllProjectsByManager', () => {
    it('should return an array of projects owned by the manager', async () => {
      const mockProjects = [{ id: 1, name: 'Project 1' }] as Project[];
      const mockManager = { id: 1, role: 'manager' };
  
      jest.spyOn(service, 'getAllProjectsByManager').mockResolvedValue(mockProjects);
  
      const result = await controller.getAllProjectsByManager({ user: mockManager });
      expect(result).toEqual(mockProjects);
      expect(service.getAllProjectsByManager).toHaveBeenCalledWith(mockManager);
    });
  });
  
  
  describe('updateProject', () => {
    it('should update an existing project', async () => {
      const mockProject = { id: 1, name: 'Updated Project' } as Project;
      const updateDto: updateProjectDto = { name: 'Updated Project' };
      const mockManager = { id: 1, role: 'manager' };
  
      jest.spyOn(service, 'updateProject').mockResolvedValue(mockProject);
  
      const result = await controller.updateProject(1, updateDto, { user: mockManager });
      expect(result).toEqual(mockProject);
      expect(service.updateProject).toHaveBeenCalledWith(1, updateDto, mockManager);
    });
  });
  
  describe('deleteProject', () => {
    it('should delete a project', async () => {
      const mockManager = { id: 1, role: 'manager' };
      jest.spyOn(service, 'deleteProject').mockResolvedValue(undefined);
  
      await controller.deleteProject(1, { user: mockManager });
      expect(service.deleteProject).toHaveBeenCalledWith(1, mockManager);
    });
  });
  
  
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
