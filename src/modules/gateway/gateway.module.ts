import { Module } from "@nestjs/common";
import { RealTimeProjectGateway } from "./real-time-project-gateway";

@Module({
    providers:[RealTimeProjectGateway],
    exports:[RealTimeProjectGateway]
})

export class GatewayModule{}