import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { Chatbot, Prisma } from '@prisma/client';

import { CreateChatbotDto } from './dto/create-chatbot.dto';
import { UpdateChatbotDto } from './dto/update-chatbot.dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { AssistantService } from '../assistant/assistant.service';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';
import * as Sentry from '@sentry/node';
import axios from 'axios';

@Injectable()
export class ChatbotService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => AssistantService))
    private readonly assistantService: AssistantService,
  ) {}

  async create(createChatbotDto: CreateChatbotDto): Promise<Chatbot> {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id: createChatbotDto.userId,
        },
        include: {
          analytics: true,
          chatBots: true,
          userPlans: {
            orderBy: {
              expiresAt: 'asc',
            },
            where: {
              currentChatbotCount: {
                gt: 0,
              },
              expiresAt: {
                gte: new Date(),
              },
            },
          },
        },
      });

      const remainingChatbotCount = user.userPlans.reduce(
        (acc, userPlan) => acc + userPlan.currentChatbotCount,
        0,
      );

      if (remainingChatbotCount <= 0) {
        throw new BadRequestException('You have reached the limit of chatbots');
      }

      const newCurrentChatbotCount = Math.max(
        user.userPlans[0].currentChatbotCount - 1,
        0,
      );

      const createdChatbot = await this.prisma.chatbot.create({
        data: {
          ...createChatbotDto,
          status: 'Active',
        },
      });

      await this.prisma.user.update({
        where: {
          id: createdChatbot.userId,
        },
        data: {
          chatBots: {
            connect: {
              id: createdChatbot.id,
            },
          },
          userPlans: {
            update: {
              where: {
                id: user.userPlans[0].id,
              },
              data: {
                currentChatbotCount: newCurrentChatbotCount,
              },
            },
          },
        },
      });

      await this.prisma.analytics.upsert({
        where: {
          userId: user.id,
        },
        update: {
          totalChatBots: { increment: 1 },
        },
        create: {
          user: {
            connect: {
              id: user.id,
            },
          },
          totalChatBots: 1,
        },
      });

      return createdChatbot;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Chatbot not found');
        }
      } else if (error instanceof PrismaClientValidationError) {
        if (error.name === 'PrismaClientValidationError') {
          Sentry.captureException(error);
          throw new ConflictException(
            'Something went wrong, please try again later.',
          );
        }
      }
      Sentry.captureException(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findAllByUser(userId: string): Promise<{
    status: string;
    data: Chatbot[];
  }> {
    const chatbots = await this.prisma.chatbot.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      status: 'success',
      data: chatbots,
    };
  }

  async findOneCurrentUser(
    id: string,
    userId: string,
  ): Promise<{
    status: string;
    data: Chatbot;
  }> {
    try {
      const chatbot = await this.prisma.chatbot.findUnique({
        where: {
          id,
          userId,
        },
      });

      return {
        status: 'success',
        data: chatbot,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Chatbot not found');
        }
      }
      Sentry.captureException(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string): Promise<Chatbot> {
    try {
      const chatbot = await this.prisma.chatbot.findUnique({
        where: {
          id,
        },
      });

      return chatbot;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Chatbot not found');
        }
      }
      Sentry.captureException(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findOneByAssistant(assistantId: string): Promise<Chatbot> {
    try {
      const chatbot = await this.prisma.chatbot.findUnique({
        where: {
          assistantId,
        },
      });

      return chatbot;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Chatbot not found');
        }
      }
      Sentry.captureException(error);
      throw new InternalServerErrorException(error);
    }
  }

  async update(updateChatbotDto: UpdateChatbotDto) {
    const { userId, assistantId, ...rest } = updateChatbotDto;

    try {
      const chatbot = await this.prisma.chatbot.update({
        where: {
          assistantId: assistantId,
          userId: userId,
        },
        data: {
          ...rest,
        },
        include: {
          user: true,
        },
      });
      return chatbot;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Chatbot not found');
        }
      }
      Sentry.captureException(error);
      throw new InternalServerErrorException(error);
    }
  }

  async updateById(id: string, updateChatbotDto: UpdateChatbotDto) {
    const { userId, ...rest } = updateChatbotDto;

    try {
      const chatbot = await this.prisma.chatbot.update({
        where: {
          id,
          userId: userId,
        },
        data: {
          ...rest,
        },
      });

      await axios.get(
        `${process.env.FRONTEND_DOMAIN}/api/revalidate/?path=/chatbot-iframe/${id}`,
      );
      return chatbot;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Chatbot not found');
        }
      }
      Sentry.captureException(error);
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string, userId: string) {
    try {
      const userPlans = await this.prisma.userPlans.findMany({
        where: {
          userId,
        },
      });

      const userPlan = userPlans.filter(
        (userPlan) =>
          userPlan.initialChatbotCount !== userPlan.currentChatbotCount,
      )?.[0];

      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          chatBots: {
            disconnect: {
              id,
            },
          },
          userPlans: {
            update: {
              where: {
                id: userPlan.id,
              },
              data: {
                currentChatbotCount: {
                  increment: 1,
                },
              },
            },
          },
        },
      });

      const chatbot = await this.prisma.chatbot.delete({
        where: {
          id,
        },
        include: {
          user: true,
        },
      });

      return chatbot;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Chatbot not found');
        }
      }
      Sentry.captureException(error);
      throw new InternalServerErrorException(error);
    }
  }

  async trainingChatbot(
    chatbotId: string,
    files: {
      id: string;
      name: string;
    }[],
  ) {
    try {
      const updateChatbot = await this.prisma.chatbot.update({
        where: {
          id: chatbotId,
        },
        data: {
          lastTrainAt: new Date(),
          files: {
            push: files,
          },
        },
      });

      return updateChatbot;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Chatbot not found');
        }
      }
      Sentry.captureException(error);
      throw new InternalServerErrorException(error);
    }
  }

  async sendMessageToChatbot({
    message,
    chatbotId,
    thread,
    assistantId,
  }: {
    message: string;
    chatbotId: string;
    thread: string;
    assistantId: string;
  }) {
    try {
      let threadId = thread || false;

      const user = await this.prisma.user.findFirst({
        where: {
          chatBots: {
            some: {
              id: chatbotId,
            },
          },
        },
      });

      if (!threadId) {
        threadId = await this.assistantService.createThread(user);
      }

      await this.prisma.analytics.upsert({
        where: {
          userId: user.id,
        },
        update: {
          totalMessages: { increment: 1 },
          totalCharacters: { increment: message.length },
        },
        create: {
          user: {
            connect: {
              id: user.id,
            },
          },
          totalMessages: 1,
          totalCharacters: message.length,
        },
      });

      return this.assistantService.sendMessage({
        message,
        chatbotId,
        threadId,
        assistantId,
      });
    } catch (error) {
      Sentry.captureException(error);
      throw new InternalServerErrorException(error);
    }
  }

  async getSuggestions(id: string) {
    try {
      const suggestions = await this.prisma.chatbot.findMany({
        where: {
          id,
        },
        select: {
          chatSuggestions: true,
        },
      });

      return suggestions;
    } catch (error) {
      Sentry.captureException(error);
      throw new InternalServerErrorException(error);
    }
  }

  async removeSuggestion(
    chatbotId: string,
    userId: string,
    itemNo?: number,
  ): Promise<Chatbot> {
    try {
      const chatbot = await this.prisma.chatbot.findFirst({
        where: {
          id: chatbotId,
          userId,
        },
        select: {
          chatSuggestions: true,
        },
      });

      if (!chatbot) {
        throw new NotFoundException('Chatbot not found');
      }

      if (itemNo) {
        chatbot.chatSuggestions.splice(itemNo - 1, 1);
      } else {
        chatbot.chatSuggestions = [];
      }

      return this.prisma.chatbot.update({
        where: {
          id: chatbotId,
        },
        data: {
          chatSuggestions: {
            set: chatbot.chatSuggestions,
          },
        },
      });
    } catch (error) {
      Sentry.captureException(error);
      throw new InternalServerErrorException(error);
    }
  }

  async activatedLead(
    chatbotId: string,
    userId: string,
    lead: {
      leadTitle?: string;
      leadName?: string;
      leadEmail?: string;
      leadPhone?: string;
    },
  ) {
    try {
      return this.prisma.chatbot.update({
        where: { id: chatbotId, userId: userId },
        data: {
          leadEmail: lead.leadEmail,
          leadName: lead.leadName,
          leadPhone: lead.leadPhone,
          leadTitle: lead.leadTitle,
          isLeadActive: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deactiveLead(chatbotId: string, userId: string) {
    try {
      return this.prisma.chatbot.update({
        where: { id: chatbotId, userId: userId },
        data: {
          leadEmail: null,
          leadName: null,
          leadPhone: null,
          leadTitle: null,
          isLeadActive: false,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async createLead(
    chatbotId: string,
    lead: {
      name?: string;
      email?: string;
      phone?: string;
    },
  ) {
    try {
      return this.prisma.leads.create({
        data: {
          chatbotId,
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getLeads(chatbotId: string, userId: string) {
    try {
      const chatBot = await this.prisma.chatbot.findFirst({
        where: {
          id: chatbotId,
          userId,
        },
      });

      if (!chatBot) {
        throw new NotFoundException('Chatbot not found');
      }

      const chatBotLead = await this.prisma.leads.findMany({
        where: {
          chatbotId,
        },
      });

      return chatBotLead;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async removeLead(leadId: string, chatbotId: string, userId: string) {
    try {
      const chatBot = await this.prisma.chatbot.findFirst({
        where: {
          id: chatbotId,
          userId: userId,
        },
      });

      if (!chatBot) {
        throw new NotFoundException('Chatbot not found');
      }

      return this.prisma.leads.delete({
        where: {
          id: leadId,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async removeAllLeads(chatbotId: string, userId: string) {
    try {
      const chatBot = await this.prisma.chatbot.findFirst({
        where: {
          id: chatbotId,
          userId,
        },
      });

      if (!chatBot) {
        throw new NotFoundException('Chatbot not found');
      }

      return this.prisma.leads.deleteMany({
        where: {
          chatbotId,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
