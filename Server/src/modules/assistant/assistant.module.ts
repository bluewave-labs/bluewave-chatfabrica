import { Module, forwardRef } from '@nestjs/common';

import { AssistantService } from './assistant.service';
import { AssistantController } from './assistant.controller';
import { PrismaService } from '../../../prisma/prisma.service';
import { ChatbotService } from '../chatbot/chatbot.service';
import { ChatbotModule } from '../chatbot/chatbot.module';
import { ChatlogModule } from '../chatlog/chatlog.module';
import { PlanModule } from '../plan/plan.module';
import { PlanService } from '../plan/plan.service';
import { HttpModule } from '@nestjs/axios';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    HttpModule,
    forwardRef(() => ChatbotModule),
    ChatlogModule,
    forwardRef(() => PlanModule),
  ],
  controllers: [AssistantController],
  providers: [AssistantService, PrismaService, PlanService, UserService],
  exports: [AssistantService],
})
export class AssistantModule {}
