import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PythonRagService } from './python-rag.service';

@Module({
  imports: [HttpModule],
  providers: [PythonRagService],
  exports: [PythonRagService],
})
export class PythonRagModule {}