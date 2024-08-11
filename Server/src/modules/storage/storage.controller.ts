import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { StorageService } from './storage.service';
import { File } from 'src/common/interface/file.interface';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 104857600 }, // 100MB --- 100*2^20
      fileFilter: (req, file, callback) => {
        if (
          file.mimetype.match(/image\/(jpg|jpeg|png|gif|webp)$/) ||
          file.mimetype.match(
            /video\/(mp4|avi|mov|quicktime|webm|x-ms-wmv|x-flv|x-matroska)$/,
          )
        ) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException('Only image and video files are allowed'),
            false,
          );
        }
      },
    }),
  )
  @Post('upload')
  async uploadFiles(@UploadedFile() uploadedFile: File): Promise<object> {
    return this.storageService.uploadFile(uploadedFile, '');
  }

  @UseInterceptors(
    FilesInterceptor('files', 10, {
      limits: { fileSize: 104857600 }, // 100MB --- 50*2^20
      fileFilter: (req, file, callback) => {
        if (
          file.mimetype.match(/image\/(jpg|jpeg|png|gif|webp)$/) ||
          file.mimetype.match(
            /video\/(mp4|avi|mov|quicktime|webm|x-ms-wmv|x-flv|x-matroska)$/,
          )
        ) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException('Only image and video files are allowed'),
            false,
          );
        }
      },
    }),
  )
  @Post('uploads')
  async uploadFile(@UploadedFiles() uploadedFiles: File[]): Promise<object[]> {
    return this.storageService.uploadFiles(uploadedFiles, '');
  }

  @Post('remove')
  async removeFile(@Body('fileName') fileName: string): Promise<void> {
    return this.storageService.removeFile(fileName);
  }
}
