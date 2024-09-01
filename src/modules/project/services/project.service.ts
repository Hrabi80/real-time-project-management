import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '../entities/project.entity';
import { Task } from '../entities/task.entity';
import { Repository } from 'typeorm';
import { createProjectDto } from '../dtos/create-project.dto';
import { Manager } from 'src/modules/user/entities/manager.entity';
import { updateProjectDto } from '../dtos/update-project.dto';

@Injectable()
export class ProjectService {

    constructor(
        @InjectRepository(Project)
        private readonly projectRepository : Repository<Project>
    ){}

    async getProjectById(id : number):Promise<Project>{
        return await this.projectRepository.findOne({
           where: { id: id},  relations:['tasks','manager']
       });
    }
   
    async createNewProject(projectData : createProjectDto,manager: Manager){
        const project = this.projectRepository.create({ ...projectData, manager });
        return await this.projectRepository.save(project);
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
        console.log("project data to update",projectUpdatedData)
        if(projectUpdatedData == null  ) throw new Error('nothing to be updated');
        if (!project) {
          throw new NotFoundException('Project not found');
        }

        if (project.manager.id !== manager.id) {
          throw new UnauthorizedException('You do not have permission to update this project');
        }
    
        Object.assign(project, projectUpdatedData);
        return await this.projectRepository.save(project);
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

      await this.projectRepository.remove(project);
     }

     
}
