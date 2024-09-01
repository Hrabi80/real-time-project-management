import { Body, OnModuleInit } from "@nestjs/common";
import { 
  WebSocketGateway, 
  WebSocketServer, 
  OnGatewayInit, 
  OnGatewayConnection, 
  OnGatewayDisconnect ,
  SubscribeMessage,
  MessageBody
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';


@WebSocketGateway() //sets up the WebSocket server, we can add cors here...
export class RealTimeProjectGateway implements OnModuleInit,OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
    @WebSocketServer() server:Server; // access to the Socket.IO server instance

    
    onModuleInit() {
        this.server.on('connection',(socket)=>{
            console.log(socket.id);
            console.log("connected...");
        })
    }
    afterInit(server: Server) {
      console.log('WebSocket server initialized');
    }

   /* function Trigger when a new client connects. */
    handleConnection(client: any) {
      console.log(`Client connected: ${client.id}`);
    }

    /* function Trigger when a client disconnects. */
    handleDisconnect(client: any) {
      console.log(`Client disconnected: ${client.id}`);
    }
  
    // Emit an event when a project is created/updated/deleted
    broadcastProjectUpdate(managerId: number) {
      this.server.emit('projectUpdated', { managerId });
    }

    // Emit an event when a task is created/updated/deleted in order that manager 
    // do not need to refresh windo
    broadcastTaskUpdate(projectId: number) {
      this.server.emit('taskUpdated',projectId);
    }
    // Emit an event to specific memeber who is assigned to that task 
    SendUpdatedTaskToAssignedUser(data:{taskId:number,userId:number,managerId: number}) {
      this.server.emit('assignedTaskUpdated',data);
    }

  

    @SubscribeMessage('testGateway')
    onNewMessage(@MessageBody() Body :any){
        console.log("message body ",Body);
        this.server.emit('onMessage',{
            message:'test my gataway from connected user',
            content: Body,
        })
    }

   
    

    
      // Example method to emit an event when a task is updated
      emitTaskUpdate(taskId: number) {
        this.server.emit('taskUpdated', { taskId });
      }
    
      // Example method to emit an event when a project is updated
      emitProjectUpdate(projectId: number) {
        this.server.emit('projectUpdated--dd', { projectId });
      }
}