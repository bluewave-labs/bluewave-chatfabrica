import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';

import { AssistantService } from './assistant.service';
import { CreateAssistantDto } from './dto/create-assistant.dto';
import { TrainingAssistantDto } from './dto/training-assistant.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateAssistantDto } from './dto/update-assistant.dto';
import { Auth } from 'src/common/decorators/auth.decorator';
import { User } from 'src/common/decorators/user.decorator';

@Controller('')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Auth()
  @Post('crawl-website')
  async crawlWebsite(
    @User() user: { sub: string },
    @Body() body: { url: string; chatbotId: string; singleUrls?: string[] },
  ) {
    return this.assistantService.crawlSite(
      body.url,
      body.chatbotId,
      user.sub,
      body.singleUrls,
    );
  }

  @Auth()
  @Post('crawl-website/single')
  async crawlWebsiteSingle(
    @User() user: { sub: string },
    @Body() body: { url: string; chatbotId: string },
  ) {
    return this.assistantService.crawlSiteSingle(
      body.url,
      body.chatbotId,
      user.sub,
    );
  }

  @Auth()
  @Post('crawl-website/sitemap')
  async crawlSiteSitemap(
    @User() user: { sub: string },
    @Body() body: { url: string; chatbotId: string },
  ) {
    return this.assistantService.crawlSiteSitemap(
      body.url,
      body.chatbotId,
      user.sub,
    );
  }

  @Auth()
  @Post('crawl-website/delete')
  async removeCrawlDetails(
    @Body() body: { fileId: string; chatbotId: string },
  ) {
    return this.assistantService.removeCrawlDetails(
      body.chatbotId,
      body.fileId,
    );
  }

  @Auth()
  @Post('chatbot-create')
  async create(
    @User() user: { sub: string },
    @Body() body: CreateAssistantDto,
  ) {
    return this.assistantService.create({
      ...body,
      userId: user.sub,
    });
  }

  @Auth()
  @Post('assistants/:assistantId/train')
  async train(
    @Param('assistantId') assistantId: string,
    @Body() body: TrainingAssistantDto,
    @User() user: { sub: string },
  ) {
    return this.assistantService.trainingAssistant(
      {
        assistantId,
        chatbotId: body.chatbotId,
        links: body.links,
        files: body.files,
        text: body.text,
      },
      user.sub,
    );
  }

  @Auth()
  @Post('chatbot-first-message')
  async firstMessage(
    @User() user: { sub: string },
    @Body() body: CreateMessageDto,
  ) {
    return this.assistantService.createFirstMessage({
      ...body,
      userId: user.sub,
    });
  }

  @Auth()
  @Post('chatbot-message')
  async sendMessage(
    @User() user: { sub: string },
    @Body() body: CreateMessageDto,
  ) {
    return this.assistantService.sendMessage({
      ...body,
      userId: user.sub,
    });
  }

  @Auth()
  @Patch('assistants/:assistantId')
  async update(
    @Param('assistantId') assistantId: string,
    @Body() body: UpdateAssistantDto,
  ) {
    return this.assistantService.update(
      assistantId,
      body.name,
      body.description,
      body.model,
      body.visibility,
      body.temperature,
    );
  }

  @Auth()
  @Delete('assistants/:chatbotId')
  async remove(
    @User() user: { sub: string },
    @Param('chatbotId') chatbotId: string,
  ) {
    return this.assistantService.remove(chatbotId, user.sub);
  }

  @Auth()
  @Post('assistants/:chatbotId')
  async deleteFile(
    @Param('chatbotId') chatbotId: string,
    @Body() body: { fileIds: string[] },
  ) {
    return this.assistantService.deleteFile(chatbotId, body.fileIds);
  }
}
