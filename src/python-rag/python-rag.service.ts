import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PythonRagService {
  private readonly pythonBaseUrl = 'http://localhost:8000'; 

  constructor(private readonly httpService: HttpService) {}

  async ingestDocument(docId: string): Promise<void> {
    console.log('Document Ingest Initiated !!')
    // await firstValueFrom(
    //   this.httpService.post(`${this.pythonBaseUrl}/ingest`, { doc_id: docId }),
    // );
  }

  async askQuestion(question: string): Promise<string> {
    const dummyAnswer = 'Sample Answer !!';
    let answer = '';
    // const response = await firstValueFrom(
    //   this.httpService.post(`${this.pythonBaseUrl}/ask`, { question }),
    // );
    // answer = response.data.answer
    answer = dummyAnswer;
    return answer;
  }
}




