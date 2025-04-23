import { Test, TestingModule } from '@nestjs/testing';
import { PythonRagService } from './python-rag.service';
import { HttpService } from '@nestjs/axios';

describe('PythonRagService', () => {
  let service: PythonRagService;

  const mockHttpService = {
    post: jest.fn(),
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PythonRagService,
        { provide: HttpService, useValue: mockHttpService },
      ],
    }).compile();

    service = module.get<PythonRagService>(PythonRagService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
