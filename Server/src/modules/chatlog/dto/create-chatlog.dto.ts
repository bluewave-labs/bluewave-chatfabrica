import { IsString } from 'class-validator';
import { Message } from 'openai/resources/beta/threads';

export class CreateChatlogDto {
  @IsString()
  message: string;

  @IsString()
  chatbotId: string;

  @IsString()
  threadId: string;

  result: Message[];
}
