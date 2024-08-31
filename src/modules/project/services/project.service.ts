import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '../entities/project.entity';
import { Task } from '../entities/task.entity';
import { Repository } from 'typeorm';
import { createProjectDto } from '../dtos/create-project.dto';

@Injectable()
export class ProjectService {

    constructor(
        @InjectRepository(Project)
        private readonly projectRepository : Repository<Project>
    ){}

    async getProjectById(id : number):Promise<Project>{
        return await this.projectRepository.findOne({
           where: { id: id},  relations:['tasks']
       });
       }
   
       async createNewProject(quiz : createProjectDto){
           return await this.projectRepository.save(quiz);
       }
}
