import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Task } from "./task.entity";
import { Manager } from "../../../modules/user/entities/manager.entity";


@Entity({name:'projects'})
export class Project extends BaseEntity{
    @ApiProperty({ description: 'Primary key as project ID', example: 1 })
    @PrimaryGeneratedColumn()
    id:number;

    @ApiProperty({ description: 'name of the project', example: 'ERP project' })
    @Column()
    name:string;

    @ApiProperty({ description: 'description of the project', example: 'the ERP project is for the client x lorem epsilom ....' })
    @Column()
    description:string;

    @ApiProperty({ description: 'the start date of the porjct '})
    @Column()
    startDate:Date;

    @ApiProperty({ description: 'the end date of the project',nullable:true})
    @Column({nullable:true})
    endDate?:Date;
    
    @OneToMany(() => Task, (task) => task.project, { onDelete: 'CASCADE' })
    tasks:  Task[];

    @ManyToOne(() => Manager, manager => manager.projects) // Define the relation with  (manager)
    manager: Manager; // The manager who owns the project

    @ApiProperty({ description: 'When project was created' })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ description: 'When project was updated' })
    @UpdateDateColumn()
    updatedAt:Date;
}
