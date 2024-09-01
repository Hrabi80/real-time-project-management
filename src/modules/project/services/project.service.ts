import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '../entities/project.entity';
import { Task } from '../entities/task.entity';
import { Repository } from 'typeorm';
import { createProjectDto } from '../dtos/create-project.dto';
import { Manager } from '../../../modules/user/entities/manager.entity';
import { updateProjectDto } from '../dtos/update-project.dto';
import { RealTimeProjectGateway } from '../../../modules/gateway/real-time-project-gateway';

@Injectable()
export class ProjectService {

    constructor(
        @InjectRepository(Project)
        private readonly projectRepository : Repository<Project>,
        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>,
        private readonly realTimeGateway: RealTimeProjectGateway, 
    ){}

    async getProjectById(id : number):Promise<Project>{
        const project =  await this.projectRepository.findOne({
           where: { id: id},  relations:['tasks','manager']
       });
       if (!project) {
        throw new NotFoundException(`Project with ID ${id} not found`);
      }
      return project;
    }
   
    async createNewProject(projectData : createProjectDto,manager: Manager){
        const project = this.projectRepository.create({ ...projectData, manager });
        const savedProject = await this.projectRepository.save(project);
        // Notify WebSocket clients about the new project
        this.realTimeGateway.broadcastProjectUpdate(manager.id);
        return savedProject;
    }

     // Method to get all projects
    async getAllProjects(): Promise<Project[]> {
      return await this.projectRepository.find({ relations: ['tasks'] });
    }

    // Method to get all projects by a specific manager
    async getAllProjectsByManager(manager: Manager): Promise<Project[]> {
      return await this.projectRepository.find({
        where: { manager: { id: manager.id } }, // Ensure correct id type
        relations: ['tasks'],
      });
    }

    async updateProject(id: number, projectUpdatedData: updateProjectDto, manager: Manager): Promise<Project> {
        const project = await this.getProjectById(id);
        if(projectUpdatedData == null  ) throw new Error('nothing to be updated');
        if (!project) {
          throw new NotFoundException('Project not found');
        }

        if (project.manager.id !== manager.id) {
          throw new UnauthorizedException('You do not have permission to update this project');
        }
    
        Object.assign(project, projectUpdatedData);
        const updatedProject = await this.projectRepository.save(project);
        // Notify WebSocket clients about the updated project
        this.realTimeGateway.broadcastProjectUpdate(manager.id);
        return updatedProject;
    }

    // Method to delete a project by ID, ensuring the manager is the owner
    async deleteProject(id: number, manager: Manager): Promise<void> {
      const project = await this.projectRepository.findOne({
        where: { id },
        relations: ['manager'],
      });

      if (!project) {
        throw new NotFoundException('Project not found');
      }

      if (project.manager.id !== manager.id) {
        throw new UnauthorizedException('You do not have permission to delete this project');
      }
      // Manually delete all tasks related to this project
      if (project.tasks && project.tasks.length > 0) {
        await this.taskRepository.remove(project.tasks);
      }
      await this.projectRepository.remove(project);
      // Notify WebSocket clients about the deleted project
       this.realTimeGateway.broadcastProjectUpdate(manager.id);
     }

     
}
