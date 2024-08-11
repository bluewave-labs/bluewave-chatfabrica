import { parse } from 'path';
import { Bucket, Storage } from '@google-cloud/storage';
import { BadRequestException, Injectable } from '@nestjs/common';

import { File } from 'src/common/interface/file.interface';
import * as Sentry from '@sentry/node';
@Injectable()
export class StorageService {
  private bucket: Bucket;
  private storage: Storage;

  constructor() {
    this.storage = new Storage({
      projectId: process.env.PROJECT_ID,
      keyFilename: 'storage-key.json',
    });
    this.bucket = this.storage.bucket('chatfabrica');
  }

  private setDestination(destination: string): string {
    let escDestination = '';
    escDestination += destination
      .replace(/^\.+/g, '')
      .replace(/^\/+|\/+$/g, '');
    if (escDestination !== '') escDestination = escDestination + '/';
    return escDestination;
  }

  private setFilename(uploadedFile: File): string {
    const fileName = parse(uploadedFile.originalname);
    return `${fileName.name}-${Date.now()}${fileName.ext}`
      .replace(/^\.+/g, '')
      .replace(/^\/+/g, '')
      .replace(/\r|\n/g, '_');
  }

  async uploadFile(uploadedFile: File, destination: string): Promise<object> {
    const fileName =
      this.setDestination(destination) + this.setFilename(uploadedFile);
    const file = this.bucket.file(fileName);
    try {
      await file.save(uploadedFile.buffer, {
        contentType: uploadedFile.mimetype,
      });
    } catch (error) {
      throw new BadRequestException((error as Error)?.message);
    }
    return {
      ...file.metadata,
      publicUrl: `https://storage.googleapis.com/${this.bucket.name}/${file.name}`,
    };
  }

  async uploadFiles(
    uploadedFiles: File[],
    destination: string,
  ): Promise<object[]> {
    const files = [];

    for (const uploadedFile of uploadedFiles) {
      const fileName =
        this.setDestination(destination) + this.setFilename(uploadedFile);
      const file = this.bucket.file(fileName);
      try {
        await file.save(uploadedFile.buffer, {
          contentType: uploadedFile.mimetype,
        });

        files.push({
          ...file.metadata,
          publicUrl: `https://storage.googleapis.com/${this.bucket.name}/${file.name}`,
        });
      } catch (error) {
        Sentry.captureException(error);
        throw new BadRequestException((error as Error)?.message);
      }
    }

    return files;
  }

  async removeFile(fileName: string): Promise<void> {
    const file = this.bucket.file(fileName);
    try {
      await file.delete();
    } catch (error) {
      Sentry.captureException(error);
      throw new BadRequestException((error as Error)?.message);
    }
  }
}
