import { Injectable, OnModuleInit } from '@nestjs/common';
import { RealTimeProjectGateway } from '../../gateway/real-time-project-gateway';
import { ProjectService } from 'src/modules/project/services/project.service';
import { Socket } from 'socket.io-client';
import { TaskService } from '../services/task.service';
@Injectable()
export class TaskListenerService{
  private socket: Socket;
  constructor(
    private readonly realTimeGateway: RealTimeProjectGateway,
    private readonly taskService: TaskService, 

    
  ) {
    this.socket = require('socket.io-client')('http://localhost:3000'); 
    this.TaskUpdatedListner();
  }


  
  // a methide emitating the client side even receiver
  private TaskUpdatedListner() {
    // Listen to 'taskUpdated' event 
    this.socket.on('taskUpdated', async (data) => {
      console.log(`Received task listner event:`);
      const updatedTasks = await this.taskService.getAllTasksByProject(data.projectId);
      return updatedTasks; // returned real time data
    });

    // Listen to 'assignedTaskUpdated' event 
    this.socket.on('assignedTaskUpdated', async (data) => {
        console.log(`Received assignedTaskUpdated listner event:`);
        const updatedTasks = await this.taskService.getAllTasksByAssignedUser(data);
        return updatedTasks; // returned real time data
      });
  }

}
