import { Module } from "@nestjs/common";
import { RealTimeGateway } from "./real-time-gateway";

@Module({
    providers:[RealTimeGateway]
})

export class GatewayModule{}