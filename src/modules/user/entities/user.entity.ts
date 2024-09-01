import { BaseEntity, BeforeInsert, Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { UserRoles } from '../enums/user.enum';
import * as bcrypt from 'bcrypt';
import { ApiProperty } from "@nestjs/swagger";
import { Task } from "../../../modules/project/entities/task.entity";
@Entity({name:'users'})
export class User extends BaseEntity{
    @ApiProperty({ description: 'Primary key as User ID', example: 1 })
    @PrimaryGeneratedColumn()
    id:number;

    @ApiProperty({ description: 'User name', example: 'Ahmed Hrabi' })
    @Column()
    name:string;

    @ApiProperty({
        description: 'User email address',
        example: 'ahmed.hrabi@gmail.com',
      })
    @Column({
        unique:true
    })
    email:string;

    @ApiProperty({ description: 'Hashed user password' })
    @Column()
    password:string;

    @Column({ type: 'enum', enum: UserRoles, default: UserRoles.MEMBER })
     role: UserRoles;

    @ManyToMany(() => Task, task => task.assignedMembers)
    tasks?: Task[];
    
    @ApiProperty({ description: 'When user was created' })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ description: 'When user was updated' })
    @UpdateDateColumn()
    updatedAt:Date;

    @BeforeInsert()
    async setPassword(password: string) {
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(password || this.password, salt);
    }
}