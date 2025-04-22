import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port  = parseInt(process.env.PORT ?? '8000')
  await app.listen(port,()=>{
    console.log(`App is working on Port - ${port}`);
  });
}
bootstrap();
