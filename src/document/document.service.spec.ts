import { DocumentService } from './document.service';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { BadRequestException } from '@nestjs/common';
import { PythonRagService } from 'src/python-rag/python-rag.service';

const mockDocRepo = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  findAndCount: jest.fn(),
};

const mockPythonService = {
  ingestDocument: jest.fn(),
  askQuestion: jest.fn(),
};

const mockFile: any = {
  originalname: 'test.pdf',
  buffer: Buffer.from('file content'),
};

describe('DocumentService - Simple', () => {
  let service: DocumentService;

  beforeEach(() => {
    service = new DocumentService(
      mockDocRepo as unknown as Repository<Document>,
      mockPythonService as unknown as PythonRagService
    );
    jest.clearAllMocks();
  });

  it('should throw if document already exists', async () => {
    mockDocRepo.findOne.mockResolvedValue({ title: 'test.pdf' });

    await expect(service.createDocAndEmbed(mockFile)).rejects.toThrow(BadRequestException);
  });

  it('should create document and call ingestion', async () => {
    mockDocRepo.findOne.mockResolvedValue(null);
    mockDocRepo.create.mockImplementation((doc) => ({ id: 1, ...doc }));
    mockDocRepo.save.mockResolvedValue({ id: 1, title: 'test.pdf' });

    const result = await service.createDocAndEmbed(mockFile);

    expect(result.data.title).toBe('test.pdf');
    expect(mockPythonService.ingestDocument).toHaveBeenCalled();
  });

  it('should return list of documents', async () => {
    mockDocRepo.findAndCount.mockResolvedValue([[{ id: 1, title: 'doc1' }], 1]);

    const res = await service.listDoc();
    expect(res.count).toBe(1);
    expect(res.data[0].title).toBe('doc1');
  });

  it('should ask a question and return answer', async () => {
    mockPythonService.askQuestion.mockResolvedValue('Mocked answer');

    const res = await service.askQuestion('What is this?');
    expect(res.answer).toBe('Mocked answer');
  });
});
