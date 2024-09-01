import { Body, Controller, Get, Request, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe, BadRequestException, Delete, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ProjectService } from '../services/project.service';
import { createProjectDto } from '../dtos/create-project.dto';
import { Project } from '../entities/project.entity';
import { SETTINGS } from '../../../utils/app.utils';
import { JwtAuthGuard } from '../../../modules/auth/guards/jwt-auth.guard';
import { ManagerRoleGuard } from '../../../modules/auth/guards/manager-role.guard';
import { updateProjectDto } from '../dtos/update-project.dto';


@ApiTags('Project')
@Controller('project')
@ApiSecurity('bearer')
@UseGuards(JwtAuthGuard)
export class ProjectController {
    constructor(private projectService : ProjectService){}
   
    @Get('/one/:id')
    async getProjectById(@Param('id', ParseIntPipe) id:number){
      const project =await this.projectService.getProjectById(id)
      if (!project) {
        throw new NotFoundException(`Project with ID ${id} not found`);
      }
        return project;
    }
    
    @Post('/')
    @ApiCreatedResponse({
        description: 'Created project object as response',
        type: Project,
      })
    @ApiBadRequestResponse({ description: 'A problem occurs when creating a project. Try again!' })
    @UseGuards(ManagerRoleGuard)
    async createProject(@Body(SETTINGS.VALIDATION_PIPE) projectData :createProjectDto,
                        @Request() req){
        const manager = req.user; // Get the authenticated manager from the request populated by the authentication process (JwtAuthGuard and ManagerRoleGuard)
        return await this.projectService.createNewProject(projectData,manager);
    }


  @Put('/:id')
  @ApiOkResponse({
    description: 'Updated project object as response',
    type: Project,
  })
  @ApiBadRequestResponse({ description: 'A problem occurs when updating the project. Try again!' })
  @UseGuards(ManagerRoleGuard)
  async updateProject(
    @Param('id', ParseIntPipe) id: number,
    @Body() projectDto: updateProjectDto,
    @Request() req,
  ) {
    const manager = req.user; //populated by the authentication process (JwtAuthGuard and ManagerRoleGuard). 
    return await this.projectService.updateProject(id, projectDto, manager);
  }


   // Endpoint to get all projects
   @Get('/')
   @ApiOkResponse({
     description: 'List of all projects',
     type: [Project],
   })
   async getAllProjects() {
     return await this.projectService.getAllProjects();
   }

  
    @Get('/project-by-manager')
    @UseGuards(ManagerRoleGuard) 
    @ApiOkResponse({
      description: 'List of projects owned by the authenticated manager',
      type: [Project],
    })
    async getAllProjectsByManager(@Request() req) {
      const manager = req.user; // Get the authenticated manager from the request
      // Ensure manager.id is a numeric string
      if (!manager || isNaN(manager.id)) {
          console.log("is nan error")
        throw new BadRequestException('Invalid manager ID');
      }

       return await this.projectService.getAllProjectsByManager(manager);
    }

    @Delete('/:id')
    @UseGuards(ManagerRoleGuard) // Only managers can access this route
    @HttpCode(HttpStatus.NO_CONTENT) // Return 204 No Content on success
    @ApiOkResponse({
      description: 'Project successfully deleted',
    })
    @ApiBadRequestResponse({ description: 'A problem occurred when deleting the project. Try again!' })
    async deleteProject(
      @Param('id', ParseIntPipe) id: number,
      @Request() req,
    ): Promise<void> {
      const manager = req.user; 
      await this.projectService.deleteProject(id, manager);
    }


    
}
