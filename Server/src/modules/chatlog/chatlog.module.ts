import { Module } from '@nestjs/common';
import { ChatlogService } from './chatlog.service';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [],
  providers: [ChatlogService, PrismaService],
  exports: [ChatlogService],
})
export class ChatlogModule {}
