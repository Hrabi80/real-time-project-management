import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectModule } from '../project/project.module';
import { testOrmConfig } from '../../config/typeorm.config';

let module: TestingModule;

beforeAll(async () => {
  module = await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot(testOrmConfig),
      ProjectModule,
    ],
  }).compile();
});

afterAll(async () => {
  await module.close();
});
