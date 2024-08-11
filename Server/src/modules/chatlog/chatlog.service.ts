import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ChatLog, Prisma } from '@prisma/client';
import { TextContentBlock } from 'openai/resources/beta/threads';
import { CreateChatlogDto } from './dto/create-chatlog.dto';
import * as Sentry from '@sentry/node';

@Injectable()
export class ChatlogService {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(createChatlogDto: CreateChatlogDto) {
    const { chatbotId, threadId, ...rest } = createChatlogDto;

    const messages = [
      {
        role: 'user',
        content: rest.message,
      },
      {
        role: 'assistant',
        content:
          (rest.result[0]?.content[0] as TextContentBlock)?.text?.value ||
          'No response',
      },
    ];

    return this.prisma.chatLog.upsert({
      where: {
        threadId,
      },
      update: {
        messages: {
          push: messages,
        },
      },
      create: {
        threadId,
        chatbot: {
          connect: {
            id: chatbotId,
          },
        },
        messages,
      },
    });
  }

  async findAllByChatbot(chatbotId: string): Promise<{
    status: string;
    data: ChatLog[];
  }> {
    const chatLogs = await this.prisma.chatLog.findMany({
      where: {
        chatbotId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      status: 'success',
      data: chatLogs,
    };
  }

  async findOneByChatbot(
    id: string,
    chatbotId: string,
  ): Promise<{
    status: string;
    data: ChatLog;
  }> {
    try {
      const logs = await this.prisma.chatLog.findUnique({
        where: {
          id,
          chatbotId,
        },
      });

      return {
        status: 'success',
        data: logs,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Chatlog not found');
        }
      }
      Sentry.captureException(error);
      throw new InternalServerErrorException(error);
    }
  }
}
