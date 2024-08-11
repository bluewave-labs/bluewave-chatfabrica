import { Module, forwardRef } from '@nestjs/common';

import { ChatbotService } from './chatbot.service';
import { ChatbotController } from './chatbot.controller';
import { PrismaService } from '../../../prisma/prisma.service';
import { AssistantModule } from '../assistant/assistant.module';
import { ChatlogModule } from '../chatlog/chatlog.module';

@Module({
  imports: [forwardRef(() => AssistantModule), ChatlogModule],
  controllers: [ChatbotController],
  providers: [ChatbotService, PrismaService],
  exports: [ChatbotService],
})
export class ChatbotModule {}
