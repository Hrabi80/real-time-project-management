import { Module } from '@nestjs/common';
import { SeedService } from './user.seed';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
;

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [SeedService],
  exports:[SeedService]
})
export class SeedModule {}
