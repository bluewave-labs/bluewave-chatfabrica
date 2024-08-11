import { Injectable } from '@nestjs/common';
import { AssistantService } from './modules/assistant/assistant.service';
import * as fs from 'fs';
import { PrismaService } from 'prisma/prisma.service';
const pdf = require('pdf-parse');

@Injectable()
export class AppService {
  constructor(
    private readonly assistantService: AssistantService,
    private prisma: PrismaService,
  ) {}

  async uploadFile(files: Express.Multer.File[], userId: string) {
    const uploadFiles = [];
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (files.length) {
      for (let i = 0; i < files.length; i++) {
        if (files[i].mimetype === 'application/pdf') {
          const file = await this.assistantService.fileUpload(
            files[i].path,
            user,
          );
          const fileContent = fs.readFileSync(files[i].path);
          const dataBuffer = await pdf(fileContent);

          uploadFiles.push({
            ...file,
            originalname: files[i].originalname,
            characterCount: dataBuffer.text.length,
          });
        }
      }
    }

    return {
      status: 'success',
      files: uploadFiles,
    };
  }
}
