import { Module } from '@nestjs/common';
import { ProjectController } from './controllers/project.controller';
import { ProjectService} from './services/project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Task } from './entities/task.entity';
import { UserModule } from '../user/user.module';
import { Manager } from '../user/entities/manager.entity';
import { User } from '../user/entities/user.entity';
import { TaskController } from './controllers/task.controller';
import { TaskService } from './services/task.service';
import { GatewayModule } from '../gateway/gateway.module';
import { RealTimeGateway } from '../gateway/real-time-gateway';

@Module({
    

  controllers: [ProjectController,TaskController],
  imports:[TypeOrmModule.forFeature([Project, Task,Manager,User]),
           UserModule ,RealTimeGateway
          ],

  providers: [ProjectService,TaskService]
})
export class ProjectModule {}
