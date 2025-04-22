import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { DocumentModule } from './document/document.module';
import { PythonRagModule } from './python-rag/python-rag.module';
 

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type:'postgres',
      host:'localhost',
      port:5432,
      username:'aryas',
      password:'postgres',
      database:'doc-management',
      entities:[User],
      autoLoadEntities: true,
      synchronize: true
    }),
    UserModule,
    AuthModule,
    DocumentModule,
    PythonRagModule,
  ],
})
export class AppModule {}
