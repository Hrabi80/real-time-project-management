import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { Project } from 'src/modules/project/entities/project.entity'
import { Task } from 'src/modules/project/entities/task.entity'
import { Manager } from 'src/modules/user/entities/manager.entity'
import { User } from 'src/modules/user/entities/user.entity'




export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (): Promise<TypeOrmModuleOptions> => {
    return{
      type: 'mysql', 
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10), 
      username: process.env.DB_USERNAME,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      entities: [User,Project,Task,Manager],
      migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
      extra: {
        charset: 'utf8mb4_unicode_ci',
      },
      synchronize: true,  //disable this in case we use migrations
      logging:true
    }
  }

}
  export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
    extra: {
      charset: 'utf8mb4_unicode_ci',
    },
    synchronize: true,
    logging: true,
  };
