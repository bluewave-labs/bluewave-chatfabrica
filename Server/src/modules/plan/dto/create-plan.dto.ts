import { PlanType } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePlanDto {
  @IsString()
  name: 'Free' | 'Hobby' | 'Standard' | 'Unlimited';

  @IsNumber()
  messageCredits: number;

  @IsNumber()
  chatbots: number;

  @IsNumber()
  charactersPerChatbot: number;

  @IsString()
  @IsOptional()
  linksToTrainOn?: string;

  @IsBoolean()
  @IsOptional()
  embedOnWebsites?: boolean;

  @IsBoolean()
  @IsOptional()
  uploadFiles?: boolean;

  @IsBoolean()
  @IsOptional()
  viewConversationHistory?: boolean;

  @IsBoolean()
  @IsOptional()
  captureLeads?: boolean;

  integrations?: {
    zapier?: boolean;
    slack?: boolean;
    wordpress?: boolean;
    whatsapp?: boolean;
    messenger?: boolean;
    gpt4Option?: boolean;
  };

  @IsNumber()
  price: number;

  @IsEnum(() => PlanType)
  type: PlanType;

  @IsString()
  variantId: string;
}
