import { Entity, OneToMany } from "typeorm";
import { User } from "./user.entity";
import { Project } from "src/modules/project/entities/project.entity";

@Entity('managers')
export class Manager extends User {
  @OneToMany(() => Project, project => project.manager)
  projects: Project[];
}
