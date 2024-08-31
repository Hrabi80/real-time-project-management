import { Module } from '@nestjs/common';
import { ProjectController } from './controllers/project.controller';
import { ProjectService} from './services/project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Task } from './entities/task.entity';
import { UserModule } from '../user/user.module';

@Module({
    

  controllers: [ProjectController],
  imports:[TypeOrmModule.forFeature([Project, Task]),
           UserModule  
          ],

  providers: [ProjectService]
})
export class ProjectModule {}
