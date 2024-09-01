import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { SeedService } from './database/seeds/user.seed';
import { SeedModule } from './database/seeds/seed.module';
async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Project management app')
    .setDescription('API documentation for NestJs real time project management application.')
    .setVersion('1.0')
    .addTag('projectManagement')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/documentation', app, document);
/*
  const seed = await NestFactory.create(SeedModule);
  const seedService = seed.get(SeedService);
  await seedService.run();
  await seed.close(); 
  */
  await app.listen(3000);
}
bootstrap();
