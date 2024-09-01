import { Injectable, OnModuleInit } from '@nestjs/common';
import { RealTimeProjectGateway } from '../../gateway/real-time-project-gateway';
import { ProjectService } from 'src/modules/project/services/project.service';
import { Socket } from 'socket.io-client';
@Injectable()
export class ProjectListenerService{
  private socket: Socket;
  constructor(
    private readonly realTimeGateway: RealTimeProjectGateway,
    private readonly projectService: ProjectService, 
    
  ) {
    this.socket = require('socket.io-client')('http://localhost:3000'); 
    this.ProjectUpdatedListner();
  }


  
  // a methide emitating the client side even receiver
  private ProjectUpdatedListner() {
    // Listen to 'projectUpdated' event 
    this.socket.on('projectUpdated', async (data) => {
      console.log(`Received Project listner event:`);
      const updatedProjects = await this.projectService.getAllProjectsByManager(data.managerId);
      return updatedProjects; // returned real time data
    });
  }

}
