import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Request } from 'express';
import { AppService } from './app.service';
import { User } from './common/decorators/user.decorator';

const UPLOADS_DIR = 'uploads/';

const storage = diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: Function) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req: Request, file: Express.Multer.File, cb: Function) => {
    const fileExt = file.originalname.slice(file.originalname.lastIndexOf('.'));
    cb(null, `${file.fieldname}-${Date.now()}${fileExt}`);
  },
});

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: storage,
      limits: { fileSize: 1024 * 1024 * 1024 },
    }),
  )
  @Post('uploads')
  async uploadFile(
    @UploadedFiles() files: Express.Multer.File[],
    @User() user: { sub: string },
  ) {
    return this.appService.uploadFile(files, user.sub);
  }
}
