import { IsOptional, IsString } from 'class-validator';

export class TrainingAssistantDto {
  @IsString()
  @IsOptional()
  assistantId?: string;

  @IsOptional()
  files: any[];

  @IsOptional()
  links: any[];

  @IsString()
  @IsOptional()
  text?: string;

  @IsString()
  chatbotId: string;
}
