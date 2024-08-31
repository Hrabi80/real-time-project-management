import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ProjectService } from '../services/project.service';
import { createProjectDto } from '../dtos/create-project.dto';
import { Project } from '../entities/project.entity';
import { SETTINGS } from 'src/utils/app.utils';
import { AdminRoleGuard } from 'src/modules/auth/guards/admin-role.guard';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { ManagerRoleGuard } from 'src/modules/auth/guards/manager-role.guard';

@ApiTags('Project')
@Controller('project')
@ApiSecurity('bearer')
@UseGuards(JwtAuthGuard)
export class ProjectController {
    constructor(private projectService : ProjectService){}
   
    @Get('/:id')
    async getProjectById(@Param('id', ParseIntPipe) id:number){
        return await this.projectService.getProjectById(id);
    }
    
    @Post('/')
    @ApiCreatedResponse({
        description: 'Created project object as response',
        type: Project,
      })
    @ApiBadRequestResponse({ description: 'A problem occurs when creating a project. Try again!' })
    @UseGuards(ManagerRoleGuard)
    async createProject(@Body(SETTINGS.VALIDATION_PIPE) projectData :createProjectDto){
        return await this.projectService.createNewProject(projectData);
    }
}
