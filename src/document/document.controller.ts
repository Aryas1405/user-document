import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AskQuestion } from './dto/document.dto';
import {AuthGuard} from './../middleware/auth.guard';
import {RoleGuard} from './../middleware/role.guard';
import { Roles } from 'src/middleware/roles.decorator';
import { UserRole } from 'src/utills/constant';

@UseGuards(AuthGuard, RoleGuard)
@Controller('document')
export class DocumentController {
  constructor(private readonly docService: DocumentService) { }

  @Post()
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(), // temp: buffer in memory
      fileFilter: (req, file, cb) => {
        const allowedExt = /\.(txt|pdf|doc|docx)$/;
        if (!file.originalname.match(allowedExt)) {
          return cb(new Error('Only .txt, .pdf, .doc, and .docx files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async createDocAndEmbed(@UploadedFile() file: Express.Multer.File) {
    return this.docService.createDocAndEmbed(file);
  }
  @Get('/list')
  @Roles(UserRole.ADMIN,UserRole.VIEWER)
  listDoc() {
    return this.docService.listDoc()
  }

  @Post('/askQuestion')
  @Roles(UserRole.ADMIN,UserRole.VIEWER)
  askQuestion(@Body() body: AskQuestion) {
    return this.docService.askQuestion(body.question)
  }
}
