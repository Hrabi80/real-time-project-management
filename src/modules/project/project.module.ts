import { Module } from '@nestjs/common';
import { ProjectController } from './controllers/project.controller';

@Module({
    

  controllers: [ProjectController]
})
export class ProjectModule {}
