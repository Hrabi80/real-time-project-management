import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from './project.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Project } from '../entities/project.entity';
import { Task } from '../entities/task.entity';
import { Repository } from 'typeorm';
import { RealTimeProjectGateway } from '../../../modules/gateway/real-time-project-gateway';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { createProjectDto } from '../dtos/create-project.dto';
import { updateProjectDto } from '../dtos/update-project.dto';
import { Manager } from '../../../modules/user/entities/manager.entity';

describe('ProjectService', () => {
  let service: ProjectService;
  let projectRepository: Repository<Project>;
  let taskRepository: Repository<Task>;
  let realTimeGateway: RealTimeProjectGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: getRepositoryToken(Project),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Task),
          useClass: Repository,
        },
        {
          provide: RealTimeProjectGateway,
          useValue: {
            broadcastProjectUpdate: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
    projectRepository = module.get<Repository<Project>>(getRepositoryToken(Project));
    taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
    realTimeGateway = module.get<RealTimeProjectGateway>(RealTimeProjectGateway);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProjectById', () => {
    it('should return the project if found', async () => {
      const project = { id: 1 } as Project;
      jest.spyOn(projectRepository, 'findOne').mockResolvedValue(project);
  
      const result = await service.getProjectById(1);
      expect(result).toEqual(project);
    });
  
    it('should throw NotFoundException if the project is not found', async () => {
      jest.spyOn(projectRepository, 'findOne').mockResolvedValue(null);
  
      await expect(service.getProjectById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createNewProject', () => {
    it('should create and return a new project', async () => {
      const projectData = { name: 'Test Project' } as createProjectDto;
      const manager = { id: 1 } as Manager;
      const savedProject = { id: 1, ...projectData, manager } as Project;
  
      jest.spyOn(projectRepository, 'create').mockReturnValue(savedProject);
      jest.spyOn(projectRepository, 'save').mockResolvedValue(savedProject);
  
      const result = await service.createNewProject(projectData, manager);
      expect(result).toEqual(savedProject);
      expect(realTimeGateway.broadcastProjectUpdate).toHaveBeenCalledWith(manager.id);
    });
  });

  describe('getAllProjects', () => {
    it('should return an array of projects', async () => {
      const projects = [{ id: 1 }] as Project[];
      jest.spyOn(projectRepository, 'find').mockResolvedValue(projects);
  
      const result = await service.getAllProjects();
      expect(result).toEqual(projects);
    });
  });

  describe('getAllProjectsByManager', () => {
    it('should return an array of projects for a specific manager', async () => {
      const manager = { id: 1 } as Manager;
      const projects = [{ id: 1 }] as Project[];
      jest.spyOn(projectRepository, 'find').mockResolvedValue(projects);
  
      const result = await service.getAllProjectsByManager(manager);
      expect(result).toEqual(projects);
    });
  });

  describe('updateProject', () => {
    it('should update and return the project if the manager is the owner', async () => {
      const project = { id: 1, manager: { id: 1 } } as Project;
      const manager = { id: 1 } as Manager;
      const updateData = { name: 'Updated Project' } as updateProjectDto;
      const updatedProject = { ...project, ...updateData } as Project;
  
      jest.spyOn(service, 'getProjectById').mockResolvedValue(project);
      jest.spyOn(projectRepository, 'save').mockResolvedValue(updatedProject);
  
      const result = await service.updateProject(1, updateData, manager);
      expect(result).toEqual(updatedProject);
      expect(realTimeGateway.broadcastProjectUpdate).toHaveBeenCalledWith(manager.id);
    });
  
    it('should throw UnauthorizedException if the manager is not the owner', async () => {
      const project = { id: 1, manager: { id: 2 } } as Project;
      const manager = { id: 1 } as Manager;
      const updateData = { name: 'Updated Project' } as updateProjectDto;
  
      jest.spyOn(service, 'getProjectById').mockResolvedValue(project);
  
      await expect(service.updateProject(1, updateData, manager)).rejects.toThrow(UnauthorizedException);
    });
  });

  
  describe('deleteProject', () => {
    it('should delete the project if the manager is the owner', async () => {
      const project = { id: 1, manager: { id: 1 }, tasks: [] } as Project;
      const manager = { id: 1 } as Manager;
  
      jest.spyOn(projectRepository, 'findOne').mockResolvedValue(project);
      jest.spyOn(taskRepository, 'remove').mockResolvedValue(project.tasks[1]);
      jest.spyOn(projectRepository, 'remove').mockResolvedValue(project);
  
      await service.deleteProject(1, manager);
  
      expect(taskRepository.remove).not.toHaveBeenCalled();
      expect(projectRepository.remove).toHaveBeenCalledWith(project);
      expect(realTimeGateway.broadcastProjectUpdate).toHaveBeenCalledWith(manager.id);
    });
  
    it('should throw NotFoundException if the project is not found', async () => {
      const manager = { id: 1 } as Manager;
  
      jest.spyOn(projectRepository, 'findOne').mockResolvedValue(null);
  
      await expect(service.deleteProject(1, manager)).rejects.toThrow(NotFoundException);
    });
  
    it('should throw UnauthorizedException if the manager is not the owner', async () => {
      const project = { id: 1, manager: { id: 2 } } as Project;
      const manager = { id: 1 } as Manager;
  
      jest.spyOn(projectRepository, 'findOne').mockResolvedValue(project);
  
      await expect(service.deleteProject(1, manager)).rejects.toThrow(UnauthorizedException);
    });
  });
  
  
  

});
