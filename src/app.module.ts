import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectModule } from './modules/project/project.module';
import { typeOrmAsyncConfig} from './config/typeorm.config';
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { SeedService } from './database/seeds/user.seed';
import { SeedModule } from './database/seeds/seed.module';

@Module({
  imports: [ TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
             ConfigModule.forRoot({
                isGlobal: true, // This ensures the ConfigModule is available globally
             }),
              ProjectModule,
              UserModule,
              AuthModule,
              SeedModule
            ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
