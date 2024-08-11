import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { CreateChatbotDto } from './dto/create-chatbot.dto';
import { CreateMessageDto } from '../assistant/dto/create-message.dto';
import { ChatlogService } from '../chatlog/chatlog.service';
import { Auth } from 'src/common/decorators/auth.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { UpdateChatbotDto } from './dto/update-chatbot.dto';

@Controller('')
export class ChatbotController {
  constructor(
    private readonly chatbotService: ChatbotService,
    private readonly chatLogService: ChatlogService,
  ) {}

  @Post()
  create(@Body() createChatbotDto: CreateChatbotDto) {
    return this.chatbotService.create(createChatbotDto);
  }

  @Auth()
  @Get('chatbots')
  getChatbotByUserId(@User() user: { sub: string }) {
    return this.chatbotService.findAllByUser(user.sub);
  }

  @Auth()
  @Delete('chatbots/:chatbotId/suggestions')
  deleteSuggestions(
    @Param('chatbotId') id: string,
    @User() user: { sub: string },
    @Query('suggestionOrder') suggestionOrder?: number,
  ) {
    return this.chatbotService.removeSuggestion(id, user.sub, suggestionOrder);
  }

  @Auth()
  @Get('chatbots/:id')
  findOneCurrentUser(@Param('id') id: string, @User() user: { sub: string }) {
    return this.chatbotService.findOneCurrentUser(id, user.sub);
  }

  @Get('iframe/chatbots/:chatbotId')
  findOne(@Param('chatbotId') id: string) {
    return this.chatbotService.findOne(id);
  }

  @Post('iframe/chatbots/:chatbotId/message')
  sendMessageToChatbot(
    @Param('chatbotId') id: string,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return this.chatbotService.sendMessageToChatbot({
      chatbotId: id,
      assistantId: createMessageDto.assistantId,
      message: createMessageDto.message,
      thread: createMessageDto.threadId,
    });
  }

  @Get('chatbots/:chatbotId/logs')
  findAllByChatbot(@Param('chatbotId') id: string) {
    return this.chatLogService.findAllByChatbot(id);
  }

  @Get('chatbots/:chatbotId/logs/:logId')
  findOneByChatbot(
    @Param('chatbotId') id: string,
    @Param('logId') logId: string,
  ) {
    return this.chatLogService.findOneByChatbot(logId, id);
  }

  @Auth()
  @Patch('chatbots/:chatbotId')
  updateById(
    @Param('chatbotId') id: string,
    @Body() updateChatbotDto: UpdateChatbotDto,
    @User() user: { sub: string },
  ) {
    return this.chatbotService.updateById(id, {
      ...updateChatbotDto,
      userId: user.sub,
    });
  }

  @Auth()
  @Post('chatbots/:chatbotId/activated-lead')
  addLead(
    @Param('chatbotId') id: string,
    @Body()
    lead: {
      leadTitle?: string;
      leadName?: string;
      leadEmail?: string;
      leadPhone?: string;
    },
    @User() user: { sub: string },
  ) {
    return this.chatbotService.activatedLead(id, user.sub, lead);
  }

  @Post('chatbots/:chatbotId/create-lead')
  createLead(
    @Param('chatbotId') id: string,
    @Body()
    lead: {
      name?: string;
      email?: string;
      phone?: string;
    },
  ) {
    return this.chatbotService.createLead(id, lead);
  }

  @Auth()
  @Get('chatbots/:chatbotId/leads')
  getLeads(@Param('chatbotId') id: string, @User() user: { sub: string }) {
    return this.chatbotService.getLeads(id, user.sub);
  }

  @Auth()
  @Delete('chatbots/:chatbotId/leads/:leadId')
  deleteLead(
    @Param('leadId') leadId: string,
    @User() user: { sub: string },
    @Param('chatbotId') chatbotId: string,
  ) {
    return this.chatbotService.removeLead(leadId, chatbotId, user.sub);
  }

  @Auth()
  @Delete('chatbots/:chatbotId/leads')
  deleteLeads(@Param('chatbotId') id: string, @User() user: { sub: string }) {
    return this.chatbotService.removeAllLeads(id, user.sub);
  }

  @Auth()
  @Get('chatbots/:chatbotId/deactivated-lead')
  getDeactivatedLeads(
    @Param('chatbotId') id: string,
    @User() user: { sub: string },
  ) {
    return this.chatbotService.deactiveLead(id, user.sub);
  }
}
