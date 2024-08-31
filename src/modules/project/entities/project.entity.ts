import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity({name:'projects'})
export class Project extends BaseEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;
}
