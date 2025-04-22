import { Test, TestingModule } from '@nestjs/testing';
import { PythonRagService } from './python-rag.service';

describe('PythonRagService', () => {
  let service: PythonRagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PythonRagService],
    }).compile();

    service = module.get<PythonRagService>(PythonRagService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
