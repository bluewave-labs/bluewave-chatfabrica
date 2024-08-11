import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import appConfig from './config/app.config';
import aiConfig from './config/ai.config';

import { PrismaService } from '../prisma/prisma.service';

import { ChatbotModule } from './modules/chatbot/chatbot.module';
import { PlanModule } from './modules/plan/plan.module';
import { AssistantModule } from './modules/assistant/assistant.module';
import { ChatlogModule } from './modules/chatlog/chatlog.module';
import { AuthModule } from './modules/auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { HealthModule } from './modules/health/health.module';
import { PrismaModule } from 'prisma/prisma.module';
import { StorageModule } from './modules/storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, aiConfig],
      envFilePath: ['.env'],
    }),
    ChatbotModule,
    PlanModule,
    AssistantModule,
    ChatlogModule,
    AuthModule,
    UserModule,
    HealthModule,
    PrismaModule,
    StorageModule,
  ],
  controllers: [AppController],
  providers: [PrismaService, AppService],
})
export class AppModule {}
