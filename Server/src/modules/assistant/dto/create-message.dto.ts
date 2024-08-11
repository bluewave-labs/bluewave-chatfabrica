import { IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  message: string;

  @IsString()
  chatbotId: string;

  @IsString()
  assistantId: string;

  @IsString()
  @IsOptional()
  threadId?: string;

  @IsString()
  @IsOptional()
  userId?: string;
}
