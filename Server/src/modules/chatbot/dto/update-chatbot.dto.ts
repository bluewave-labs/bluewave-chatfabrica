import { PartialType } from '@nestjs/mapped-types';
import { Visibility } from '@prisma/client';

import { CreateChatbotDto } from './create-chatbot.dto';

export class UpdateChatbotDto extends PartialType(CreateChatbotDto) {
  visibility: Visibility;
}
