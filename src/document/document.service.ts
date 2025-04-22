import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { Repository } from 'typeorm';
import { PythonRagService } from 'src/python-rag/python-rag.service';
import * as fs from 'fs/promises';
import * as path from 'path';


@Injectable()
export class DocumentService {
    constructor(
        @InjectRepository(Document)
        private readonly docRepo: Repository<Document>,
        private readonly pythonBackendService: PythonRagService
    ) { }

    async createDocAndEmbed(file: Express.Multer.File): Promise<{ data: Document; message: string }> {
        const title = file.originalname;
      
        const docExist = await this.docRepo.findOne({ where: { title } });
        if (docExist) {
          throw new BadRequestException('Document already exists!');
        }
      
        const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
        await fs.mkdir(uploadsDir, { recursive: true });
      
        const ext = path.extname(file.originalname);
        const filename = `DOC-${Date.now()}${ext}`;
        const filePath = path.join(uploadsDir, filename);
      
        await fs.writeFile(filePath, file.buffer);
      
        const doc = this.docRepo.create({
          title,
          code: filename.split('.')[0],
          embeded: false,
          filePath: path.relative(process.cwd(), filePath), 
        });
      
        const savedDoc = await this.docRepo.save(doc);
        this.pythonBackendService.ingestDocument(filePath);
        return { data: savedDoc, message: 'Document uploaded and ingestion started' };
      }


    async listDoc(): Promise<{ data: Document[], count: number }> {
        const [doc, count] = await this.docRepo.findAndCount({ where: {} });
        return { data: doc, count };
    }

    async askQuestion(question: string): Promise<{answer:string}> {
        const answer = await this.pythonBackendService.askQuestion(question);
        return { answer };
    }    
}
