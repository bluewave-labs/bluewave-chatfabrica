import * as fs from 'fs/promises';
import * as fsOriginal from 'fs';
import * as path from 'path';

import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';
// eslint-disable-next-line import/no-unresolved
import { Message } from 'openai/resources/beta/threads/messages';
// eslint-disable-next-line import/no-unresolved
import { FileObject } from 'openai/resources';

import { AllConfigType } from '../../config/config.type';
import { PrismaService } from '../../../prisma/prisma.service';
import { defaultInstructions, defaultModel } from './constants';
import { CreateAssistantDto } from './dto/create-assistant.dto';
import { ChatbotService } from '../chatbot/chatbot.service';
import { TrainingAssistantDto } from './dto/training-assistant.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { ChatlogService } from '../chatlog/chatlog.service';
import { User, Visibility } from '@prisma/client';
import { MailerService } from '@nestjs-modules/mailer';
import * as Sentry from '@sentry/node';
import { PlanService } from '../plan/plan.service';
import { modelMessageCost } from 'src/utils/constant';
import { UserService } from '../user/user.service';

@Injectable()
export class AssistantService {
  private readonly client: OpenAI;
  private readonly model = defaultModel;

  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => ChatbotService))
    private readonly chatbotService: ChatbotService,
    private readonly chatLogService: ChatlogService,
    private readonly mailerService: MailerService,
    private readonly planService: PlanService,
    private readonly userService: UserService,
  ) {
    this.client = new OpenAI({
      apiKey: configService.get('ai.apiKey', { infer: true }),
    });
  }

  async crawlSite(
    url: string,
    chatbotId: string,
    userId: string,
    singleUrls?: string[],
  ) {
    try {
      if (!chatbotId) {
        throw new ConflictException('Invalid data');
      }

      if (!url && !singleUrls?.length) {
        throw new ConflictException('Invalid data');
      }

      const user = await this.prisma.user.findFirst({
        where: {
          id: userId,
        },
      });

      const chatbot = await this.prisma.chatbot.findUnique({
        where: {
          id: chatbotId,
          userId: user.id,
        },
      });

      if (!chatbot) {
        throw new NotFoundException('Chatbot does not exist');
      }

      const links = [];

      if (url) {
        const response = await fetch(
          this.configService.get('app.crawlApiUrl', { infer: true }),
          {
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
              url,
            }),
          },
        );

        if (!response.ok) {
          Sentry.captureException('Error in crawling website');
          throw new BadRequestException('Error in crawling website');
        }

        const result = await response.json();
        const pages: {
          url: string;
          title: string;
          body: string;
          characterCount: number;
        }[] = result.page_content;

        for await (const page of pages) {
          let specialCharacterRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?]+/g;
          let name = page.url;
          name = name.replace(specialCharacterRegex, '');
          const filename =
            name.substring(0, 70).split('/').pop() + Math.random().toString(36);

          const filePath = path.join(process.cwd(), `/uploads/${filename}.txt`);
          await fs.writeFile(filePath, page.body);

          const uploadedFile = await this.fileUpload(filePath, user);
          await fs.rm(filePath);

          links.push({
            id: uploadedFile.id,
            name: uploadedFile.filename,
            body: page.body,
            url: page.url,
            characterCount: page.characterCount,
          });
        }
      }

      if (singleUrls?.length) {
        for await (const singleUrl of singleUrls) {
          const response = await fetch(
            `${this.configService.get('app.crawlApiUrl', {
              infer: true,
            })}/single`,
            {
              headers: {
                'Content-Type': 'application/json',
              },
              method: 'POST',
              body: JSON.stringify({
                url: singleUrl,
              }),
            },
          );

          if (!response.ok) {
            Sentry.captureException('Error in crawling website');
            throw new BadRequestException('Error in crawling website');
          }

          const result = await response.json();
          const page: {
            url: string;
            title: string;
            body: string;
            characterCount: number;
          } = result.page_content;

          const filename =
            page.url.split('/').pop() + Math.random().toString(36);

          const filePath = path.join(process.cwd(), `/uploads/${filename}.txt`);
          await fs.writeFile(filePath, page.body);

          const uploadedFile = await this.fileUpload(filePath, user);
          await fs.rm(filePath);

          links.push({
            id: uploadedFile.id,
            name: uploadedFile.filename,
            body: page.body,
            url: page.url,
            characterCount: page.characterCount,
          });
        }
      }

      return {
        status: 'success',
        links,
      };
    } catch (error) {
      Sentry.captureException(error);
      throw new InternalServerErrorException(error);
    }
  }

  async crawlSiteSingle(url: string, chatbotId: string, userId: string) {
    try {
      if (!url || !chatbotId) {
        throw new ConflictException('Invalid data');
      }

      const user = await this.prisma.user.findFirst({
        where: {
          id: userId,
        },
      });

      const chatbot = await this.prisma.chatbot.findUnique({
        where: {
          id: chatbotId,
          userId: user.id,
        },
      });

      if (!chatbot) {
        throw new NotFoundException('Chatbot does not exist');
      }

      const response = await fetch(
        `${this.configService.get('app.crawlApiUrl', { infer: true })}/single`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            url,
          }),
        },
      );

      if (!response.ok) {
        Sentry.captureException('Error in crawling website');
        throw new BadRequestException('Error in crawling website');
      }

      const result = await response.json();
      const page: {
        url: string;
        title: string;
        body: string;
        characterCount: number;
      } = result.page_content;
      const files = [];

      const filename = page.url.split('/').pop() + Math.random().toString(36);

      const filePath = path.join(process.cwd(), `/uploads/${filename}.txt`);
      await fs.writeFile(filePath, page.body);

      const uploadedFile = await this.fileUpload(filePath, user);
      await fs.rm(filePath);

      files.push({
        id: uploadedFile.id,
        name: uploadedFile.filename,
        url: page.url,
        characterCount: page.characterCount,
      });

      await this.prisma.chatbot.update({
        where: {
          id: chatbotId,
        },
        data: {
          crawlDetails: {
            set: chatbot.crawlDetails.concat({
              fileId: uploadedFile.id,
              url: page.url,
              name: uploadedFile.filename,
              charactersCount: page.characterCount,
              body: page.body,
            }),
          },
        },
      });

      return {
        status: 'success',
        files,
      };
    } catch (error) {
      Sentry.captureException(error);
      throw new InternalServerErrorException(error);
    }
  }

  async crawlSiteSitemap(url: string, chatbotId: string, userId: string) {
    try {
      if (!url || !chatbotId) {
        throw new ConflictException('Invalid data');
      }

      const user = await this.prisma.user.findFirst({
        where: {
          id: userId,
        },
      });

      const chatbot = await this.prisma.chatbot.findUnique({
        where: {
          id: chatbotId,
          userId: user.id,
        },
      });

      if (!chatbot) {
        throw new NotFoundException('Chatbot does not exist');
      }

      const response = await fetch(
        `${this.configService.get('app.crawlApiUrl', { infer: true })}/sitemap`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            xmlUrl: url,
          }),
        },
      );

      if (!response.ok) {
        Sentry.captureException('Error in crawling website');
        throw new BadRequestException('Error in crawling website');
      }

      const result = await response.json();
      const pages: {
        url: string;
        title: string;
        body: string;
        characterCount: number;
      }[] = result.page_content;

      const files = [];

      for await (const page of pages) {
        const filename =
          page.url?.split('/')?.pop() + Math.random().toString(36);

        const filePath = path.join(process.cwd(), `/uploads/${filename}.txt`);
        await fs.writeFile(filePath, page.body);

        const uploadedFile = await this.fileUpload(filePath, user);
        await fs.rm(filePath);

        files.push({
          id: uploadedFile.id,
          name: uploadedFile.filename,
          url: page.url,
          characterCount: page.characterCount,
        });

        await this.prisma.chatbot.update({
          where: {
            id: chatbotId,
          },
          data: {
            crawlDetails: {
              set: chatbot.crawlDetails.concat({
                fileId: uploadedFile.id,
                url: page.url,
                name: uploadedFile.filename,
                charactersCount: page.characterCount,
                body: page.body,
              }),
            },
          },
        });
      }

      return {
        status: 'success',
        files,
      };
    } catch (error) {
      Sentry.captureException(error);
      throw new InternalServerErrorException(error);
    }
  }

  async removeCrawlDetails(
    chatbotId: string,
    fileId: string,
  ): Promise<{ status: string }> {
    try {
      const chatbot = await this.prisma.chatbot.findUnique({
        where: {
          id: chatbotId,
        },
      });

      await this.prisma.chatbot.update({
        where: {
          id: chatbotId,
        },
        data: {
          crawlDetails: {
            set: chatbot.crawlDetails.filter(
              (detail) => detail.fileId !== fileId,
            ),
          },
        },
      });

      return {
        status: 'success',
      };
    } catch (error) {
      Sentry.captureException(error);
      throw new InternalServerErrorException(error);
    }
  }

  async create(createAssistantDto: CreateAssistantDto): Promise<{
    status: string;
    _id: string;
    name: string;
    assistantId: string;
  }> {
    const randomNumber = Math.floor(Math.random() * 100000);
    const name = `Untitled ${randomNumber}`;

    const { userId } = createAssistantDto;

    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    // await checkPlanLimit(user);
    let client;
    if (!user.openAIKey) {
      throw new BadRequestException(
        'OpenAI key is required. You can add an API key from the profile screen by clicking on the icon in the top right.',
      );
    }
    client = new OpenAI({
      apiKey: this.userService.decryptApiKey(user.openAIKey),
    });

    const response = await client.beta.assistants.create({
      name,
      instructions: defaultInstructions,
      model: this.model,
      tools: [{ type: 'file_search' }],
      temperature: 0.2,
    });

    const chatbot = await this.chatbotService.create({
      name,
      assistantId: response.id,
      userId,
      instructions: defaultInstructions,
      model: this.model,
      chatSuggestions: [],
    });

    return {
      status: 'success',
      _id: chatbot.id,
      name,
      assistantId: response.id,
    };
  }

  async update(
    assistantId: string,
    name: string,
    instructions: string,
    model: string,
    visibility: Visibility,
    temperature?: number,
  ): Promise<{
    status: string;
  }> {
    try {
      const chatbot = await this.chatbotService.update({
        assistantId,
        name,
        instructions,
        model,
        visibility,
        temperature,
      });

      let client;
      if (!chatbot.user.openAIKey) {
        throw new BadRequestException(
          'OpenAI key is required. You can add an API key from the profile screen by clicking on the icon in the top right.',
        );
      }
      client = new OpenAI({
        apiKey: this.userService.decryptApiKey(chatbot.user.openAIKey),
      });

      await client.beta.assistants.update(assistantId, {
        name,
        instructions,
        model,
        temperature,
      });

      return {
        status: 'success',
      };
    } catch (error) {
      Sentry.captureException(error);
      throw new InternalServerErrorException(error);
    }
  }

  async remove(
    chatbotId: string,
    userId: string,
  ): Promise<{
    status: string;
  }> {
    try {
      const deletedChatbot = await this.chatbotService.remove(
        chatbotId,
        userId,
      );
      let client;
      if (!deletedChatbot.user.openAIKey) {
        throw new BadRequestException(
          'OpenAI key is required. You can add an API key from the profile screen by clicking on the icon in the top right.',
        );
      }
      client = new OpenAI({
        apiKey: this.userService.decryptApiKey(deletedChatbot.user.openAIKey),
      });

      await client.beta.assistants.del(deletedChatbot.assistantId);

      return {
        status: 'success',
      };
    } catch (error) {
      Sentry.captureException(error);
      throw new InternalServerErrorException(error);
    }
  }

  async trainingAssistant(
    trainingAssistantDto: TrainingAssistantDto,
    userId: string,
  ) {
    try {
      const { assistantId, chatbotId, text, files, links } =
        trainingAssistantDto;

      const trainingFiles = [];
      let textFile: { id: string; filename: string };

      const user = await this.prisma.user.findFirst({
        where: {
          id: userId,
        },
        include: {
          userPlans: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
            where: {
              expiresAt: {
                gte: new Date(),
              },
              plan: {
                isExtraPacket: false,
              },
            },
            select: {
              id: true,
              plan: true,
              createdAt: true,
              expiresAt: true,
              status: true,
            },
          },
        },
      });

      const chatbot = await this.prisma.chatbot.findFirst({
        where: {
          id: chatbotId,
          userId: user.id,
        },
      });

      if (!chatbot) {
        throw new NotFoundException('Chatbot does not exist');
      }

      let limitLink = 10;
      const userPlan = user.userPlans[0];
      const totalCharacters =
        text?.length +
        links?.reduce((acc, link) => acc + link.characterCount, 0) +
        files?.reduce((acc, file) => acc + file.characterCount, 0);

      if (userPlan && !userPlan.plan.isFree) {
        limitLink = Number.MAX_VALUE;
      }

      if (totalCharacters > userPlan.plan.charactersPerChatbot) {
        throw new BadRequestException(
          userPlan && !userPlan.plan.isFree
            ? `You can only train your chatbot on max ${userPlan.plan.charactersPerChatbot} characters.`
            : `You can only train your chatbot on max ${userPlan.plan.charactersPerChatbot} characters on a free plan. Please upgrade.`,
        );
      }

      if (text) {
        if (
          (chatbot.files as { type: string }[]).filter(
            (file) => file.type === 'text',
          ).length
        ) {
          const textData = (
            chatbot.files as {
              id: string;
              name: string;
              type: string;
              body: string;
            }[]
          ).find((file) => file.type === 'text');

          textData.body = text;

          textFile = {
            id: textData.id,
            filename: textData.name,
          };

          trainingFiles.push({
            id: textData.id,
            name: textData.name,
            body: text + ' Answer in the language asked.',
            characterCount: text.length,
          });
        } else {
          const filename =
            text
              .slice(
                text.indexOf(' ') + 1,
                text.indexOf(' ', text.indexOf(' ') + 1),
              )
              .split('/')
              .pop() + Math.random().toString(36);
          const filePath = path.join(process.cwd(), `/uploads/${filename}.txt`);
          await fs.writeFile(filePath, text);

          const uploadedFile = await this.fileUpload(filePath, user);
          await fs.rm(filePath);

          textFile = uploadedFile;

          trainingFiles.push({
            id: uploadedFile.id,
            name: uploadedFile.filename,
            body: text,
            characterCount: text.length,
          });
        }
      }

      if (links) {
        if (links.length > chatbot.links.length) {
          if (links.length > limitLink) {
            throw new BadRequestException(
              'You can only train your chatbot on max 10 links on a free plan. Please upgrade.',
            );
          }
        }

        for (const link of links) {
          trainingFiles.push({
            id: link.id,
            name: link.name,
            url: link.url,
            characterCount: link.characterCount,
            body: link.body,
          });
        }

        await this.prisma.chatbot.update({
          where: {
            id: chatbotId,
          },
          data: {
            trainingDatas: {
              set: links.map((link) => ({
                fileId: link.id,
                name: link.name,
                charactersCount: link.characterCount,
                url: link.url,
                body: link.body,
              })),
            },
          },
        });
      }

      if (files) {
        for (const file of files) {
          trainingFiles.push({
            id: file.id,
            name: file.filename,
            characterCount: file.characterCount,
          });
        }
      }

      let client;
      if (!user.openAIKey) {
        throw new BadRequestException(
          'OpenAI key is required. You can add an API key from the profile screen by clicking on the icon in the top right.',
        );
      }
      client = new OpenAI({
        apiKey: this.userService.decryptApiKey(user.openAIKey),
      });

      const vectorStore = await client.beta.vectorStores.create({
        name: user.id + '_vector_store',
        file_ids: trainingFiles.map((file) => file.id),
      });

      await client.beta.assistants.update(assistantId, {
        tool_resources: {
          file_search: {
            vector_store_ids: [vectorStore.id],
          },
        },
      });

      const updatedFiles = [];
      let hasTextFile = false;

      for (const file of files) {
        const fileType = file.name.includes('.txt') ? 'text' : 'file';

        if (fileType === 'text') {
          hasTextFile = true;
        }

        updatedFiles.push({
          id: file.id,
          name: file.name,
          characterCount: file.characterCount,
          type: fileType,
        });
      }

      if (text) {
        if (hasTextFile) {
          const textFileIndex = updatedFiles.findIndex(
            (file) => file.type === 'text',
          );
          if (textFileIndex !== -1) {
            updatedFiles.splice(textFileIndex, 1);
          }
        }

        updatedFiles.push({
          id: textFile.id,
          name: textFile.filename,
          characterCount: text.length,
          body: text,
          type: 'text',
        });
      }

      await this.prisma.chatbot.update({
        where: {
          id: chatbotId,
        },
        data: {
          files: updatedFiles,
        },
      });

      await this.prisma.analytics.upsert({
        where: {
          userId: user.id,
        },
        update: {
          totalCharacters: { increment: text.length },
          totalTrain: { increment: 1 },
        },
        create: {
          user: {
            connect: {
              id: user.id,
            },
          },
          totalCharacters: text.length,
          totalTrain: 1,
        },
      });

      return {
        status: 'success',
      };
    } catch (error) {
      console.error(`Error in trainingAssistant: ${error.message}`);
      Sentry.captureException(error);
      throw new InternalServerErrorException(error);
    }
  }

  async createFirstMessage(createMessageDto: CreateMessageDto) {
    try {
      const { assistantId, message, chatbotId } = createMessageDto;

      const users = await this.prisma.userPlans.findMany({
        where: { user: null },
      });

      const chatbot = await this.prisma.chatbot.findFirst({
        where: {
          id: chatbotId,
        },
        include: {
          user: {
            include: {
              userPlans: {
                orderBy: {
                  expiresAt: 'asc',
                },
                where: {
                  currentMessageCredits: {
                    gt: 0,
                  },
                  expiresAt: {
                    gte: new Date(),
                  },
                },
              },
            },
          },
        },
      });

      const totalMsgCredits = chatbot.user.userPlans.reduce(
        (acc, userPlan) => acc + userPlan.currentMessageCredits,
        0,
      );

      const modelCreditCost =
        chatbot.model === 'gpt-4o'
          ? modelMessageCost.gpt4o
          : modelMessageCost.gpt4omini;

      if (totalMsgCredits < modelCreditCost) {
        throw new BadRequestException('User has no credits');
      }

      const threadId = await this.createThread(chatbot.user);
      await this.createMessage(threadId, message, chatbot.user);
      await this.runAssistant(assistantId, threadId, chatbot.user);

      const response = await this.getResponse(threadId, chatbot.user);

      response[0].content.map((i) => {
        if ('text' in i) {
          i.text.value = i.text.value.replace(/【.*?】/g, '');
        }
      });

      await this.chatLogService.upsert({
        message,
        chatbotId,
        threadId,
        result: response,
      });

      const newCurrentMsgCredit = Math.max(
        chatbot.user.userPlans[0].currentMessageCredits - modelCreditCost,
        0,
      );

      await this.prisma.user.update({
        where: {
          id: chatbot.userId,
        },
        data: {
          customMessageCredits: { decrement: modelCreditCost },
          userPlans: {
            update: {
              where: {
                id: chatbot.user.userPlans[0].id,
              },
              data: {
                currentMessageCredits: newCurrentMsgCredit,
              },
            },
          },
        },
      });

      this.mailerService
        .sendMail({
          to: chatbot.user.email,
          subject: 'New message to your chat bot',
          template: './first-message',
          context: {
            message,
          },
        })
        .catch((error) => {
          Sentry.captureException(error);
        });

      await this.planService.checkCredit(chatbot.user);

      return {
        status: 'success',
        threadId,
        response,
      };
    } catch (error) {
      console.error(`Error in sendMessage: ${error.message}`);
      Sentry.captureException(error);
      throw new InternalServerErrorException(error);
    }
  }

  async sendMessage(createMessageDto: CreateMessageDto) {
    try {
      const { assistantId, threadId, message, chatbotId } = createMessageDto;

      const chatbot = await this.prisma.chatbot.findUnique({
        where: {
          id: chatbotId,
        },
        select: {
          user: true,
        },
      });

      await this.createMessage(threadId, message, chatbot.user);
      await this.runAssistant(assistantId, threadId, chatbot.user);
      const response = await this.getResponse(threadId, chatbot.user);

      await this.prisma.analytics.upsert({
        where: {
          userId: chatbot.user.id,
        },
        update: {
          totalSpech: { increment: 1 },
          totalMessages: { increment: 1 },
          totalCharacters: { increment: message.length },
        },
        create: {
          user: {
            connect: {
              id: chatbot.user.id,
            },
          },
          totalSpech: 1,
          totalMessages: 1,
          totalCharacters: message.length,
        },
      });

      response[0].content.map((i) => {
        if ('text' in i) {
          i.text.value = i.text.value.replace(/【.*?】/g, '');
        }
      });

      await this.chatLogService.upsert({
        message,
        chatbotId,
        threadId,
        result: response,
      });

      return {
        status: 'success',
        response,
      };
    } catch (error) {
      console.error(`Error in sendMessage: ${error.message}`);
      Sentry.captureException(error);
      throw new InternalServerErrorException(error);
    }
  }

  async createThread(user: User): Promise<string> {
    let client;
    if (!user.openAIKey) {
      throw new BadRequestException(
        'OpenAI key is required. You can add an API key from the profile screen by clicking on the icon in the top right.',
      );
    }
    client = new OpenAI({
      apiKey: this.userService.decryptApiKey(user.openAIKey),
    });

    const threadResponse = await client.beta.threads.create();
    return threadResponse.id;
  }

  async createMessage(
    threadId: string,
    message: string,
    user: User,
  ): Promise<Message> {
    let client;

    if (!user.openAIKey) {
      throw new BadRequestException(
        'OpenAI key is required. You can add an API key from the profile screen by clicking on the icon in the top right.',
      );
    }
    client = new OpenAI({
      apiKey: this.userService.decryptApiKey(user.openAIKey),
    });

    return client.beta.threads.messages.create(threadId, {
      role: 'user',
      content: message,
    });
  }

  async runAssistant(
    assistantId: string,
    threadId: string,
    user: User,
  ): Promise<void> {
    let client;
    if (!user.openAIKey) {
      throw new BadRequestException(
        'OpenAI key is required. You can add an API key from the profile screen by clicking on the icon in the top right.',
      );
    }
    client = new OpenAI({
      apiKey: this.userService.decryptApiKey(user.openAIKey),
    });

    const runResponse = await client.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    });

    let run = await client.beta.threads.runs.retrieve(threadId, runResponse.id);
    while (run.status !== 'completed') {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      run = await client.beta.threads.runs.retrieve(threadId, runResponse.id);
    }
  }

  async getResponse(threadId: string, user: User): Promise<Message[]> {
    let client;
    if (!user.openAIKey) {
      throw new BadRequestException(
        'OpenAI key is required. You can add an API key from the profile screen by clicking on the icon in the top right.',
      );
    }
    client = new OpenAI({
      apiKey: this.userService.decryptApiKey(user.openAIKey),
    });

    const messagesResponse = await client.beta.threads.messages.list(threadId);
    return messagesResponse.data.filter((msg) => msg.role === 'assistant');
  }

  async deleteFiles(
    assistantId: string,
    fileIds: string[],
    user: User,
  ): Promise<boolean> {
    try {
      let client: OpenAI;

      if (!user.openAIKey) {
        throw new BadRequestException(
          'OpenAI key is required. You can add an API key from the profile screen by clicking on the icon in the top right.',
        );
      }
      client = new OpenAI({
        apiKey: this.userService.decryptApiKey(user.openAIKey),
      });

      await Promise.all(fileIds.map((fileId) => client.files.del(fileId)));
      return true;
    } catch (error) {
      return true;
    }
  }

  async deleteFile(
    chatbotId: string,
    fileIds: string[],
  ): Promise<{ status: string }> {
    try {
      const chatbot = await this.prisma.chatbot.findFirst({
        where: {
          id: chatbotId,
        },
        include: {
          user: true,
        },
      });

      const newFiles = chatbot.files.filter(
        (file: { id: string }) => !fileIds.includes(file.id),
      );

      const updatedTrainingData = chatbot.trainingDatas.filter(
        (trainingData: { fileId: string }) =>
          !fileIds.includes(trainingData.fileId),
      );

      try {
        this.deleteFiles(chatbot.assistantId, fileIds, chatbot.user);

        await this.prisma.chatbot.update({
          where: {
            id: chatbotId,
          },
          data: {
            files: newFiles,
            trainingDatas: updatedTrainingData,
          },
        });
      } catch (error) {
        Sentry.captureException(error);
        throw new InternalServerErrorException(error);
      }

      return {
        status: 'success',
      };
    } catch (error) {
      Sentry.captureException(error);
      throw new InternalServerErrorException(error);
    }
  }

  async fileUpload(fileDirectory: string, user: User): Promise<FileObject> {
    const fileStream: fsOriginal.ReadStream =
      fsOriginal.createReadStream(fileDirectory);
    let client;
    if (!user.openAIKey) {
      throw new BadRequestException(
        'OpenAI key is required. You can add an API key from the profile screen by clicking on the icon in the top right.',
      );
    }
    client = new OpenAI({
      apiKey: this.userService.decryptApiKey(user.openAIKey),
    });

    const file = await client.files.create({
      file: fileStream,
      purpose: 'assistants',
    });
    return file;
  }

  filterFiles(files: { type: string }[], excludeType: string) {
    return files.filter((file) => file.type !== excludeType);
  }
}
