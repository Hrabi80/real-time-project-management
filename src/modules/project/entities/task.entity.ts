import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TaskStates } from "../enums/status.enum";
import { Project } from "./project.entity";
import { User } from "../../../modules/user/entities/user.entity";


@Entity({name:'tasks'})
export class Task extends BaseEntity{
    @ApiProperty({ description: 'Primary key as Task ID', example: 1 })
    @PrimaryGeneratedColumn()
    id:number;

    @ApiProperty({ description: 'Title of the task', example: 'Design UI' })
    @Column()
    title:string;

    @ApiProperty({ description: 'Description of the task', example: 'Design the user interface for the main dashboard' })
    @Column()
    description: string;

    @ApiProperty({ description: 'State of the task', enum: TaskStates, example: TaskStates.IN_PROGRESS })
    @Column({ type: 'enum', enum: TaskStates, default: TaskStates.NOT_STARTING })
    state: TaskStates;

    @ApiProperty({ description: 'The deadline for the task', example: '2024-09-30' })
    @Column()
    deadline: Date;

    @ApiProperty({ description: 'The date when the user was assigned to the task', example: '2024-08-30' })
    @Column({nullable:true})
    assignedDate?: Date;

    @ManyToMany(() => User, user => user.tasks) // Define many-to-many relationship with User
    @JoinTable({ name: 'task_users' }) // Specify the join table
    @ApiProperty({ description: 'Users assigned to the task', type: () => [User] })
    assignedMembers?: User[];

    @ManyToOne(() => Project, project => project.tasks)
    project: Project;


    @ApiProperty({ description: 'When the task was created' })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ description: 'When the task was updated' })
    @UpdateDateColumn()
    updatedAt: Date;
}
