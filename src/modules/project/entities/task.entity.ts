import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity({name:'tasks'})
export class Task extends BaseEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    title:string;
}
