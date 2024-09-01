import { Body, OnModuleInit } from "@nestjs/common";
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
@WebSocketGateway()
export class RealTimeGateway implements OnModuleInit,OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
    @WebSocketServer() server:Server;

    onModuleInit() {
        this.server.on('connection',(socket)=>{
            console.log(socket.id);
            console.log("connected...")
        })
    }

    @SubscribeMessage('testGateway')
    onNewMessage(@MessageBody() Body :any){
        console.log("message body ",Body);
        this.server.emit('onMessage',{
            message:'new Message test',
            content: Body,
        })
    }

    afterInit(server: Server) {
        console.log('WebSocket server initialized');
      }
    
      handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
      }
    
      handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
      }
    
      // Example method to emit an event when a task is updated
      emitTaskUpdate(taskId: number) {
        this.server.emit('taskUpdated', { taskId });
      }
    
      // Example method to emit an event when a project is updated
      emitProjectUpdate(projectId: number) {
        this.server.emit('projectUpdated', { projectId });
      }
}