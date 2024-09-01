import { Controller, UseGuards } from "@nestjs/common";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";
import { TaskService } from "../services/task.service";

@ApiTags('Task')
@Controller('task')
@ApiSecurity('bearer')
@UseGuards(JwtAuthGuard)
export class TaskController {
    constructor(private projectService : TaskService){}

}