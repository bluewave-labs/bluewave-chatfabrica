import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // 32 byte key
  private readonly IV_LENGTH = 16; // For AES, this is always 16

  async getAnalytics(userId: string) {
    return await this.prisma.analytics.findFirst({
      where: { userId },
    });
  }

  private encryptApiKey(apiKey: string): string {
    const iv = crypto.randomBytes(this.IV_LENGTH);
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(this.ENCRYPTION_KEY),
      iv,
    );
    let encrypted = cipher.update(apiKey);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  decryptApiKey(encryptedApiKey: string): string {
    const textParts = encryptedApiKey.split(':');
    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(this.ENCRYPTION_KEY),
      iv,
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }

  async updateApiKey(userId: string, apiKey: string): Promise<void> {
    const encryptedApiKey = this.encryptApiKey(apiKey);
    await this.prisma.user.update({
      where: { id: userId },
      data: { openAIKey: encryptedApiKey },
    });
  }
}
