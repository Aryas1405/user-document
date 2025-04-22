import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { PythonRagModule } from 'src/python-rag/python-rag.module';

@Module({
  imports: [TypeOrmModule.forFeature([Document]),PythonRagModule],
  providers: [DocumentService],
  controllers: [DocumentController],
  exports: [DocumentService],
})
export class DocumentModule { }
