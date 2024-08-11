import { Align, Theme } from '@prisma/client';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  IsNumber,
  IsEnum,
} from 'class-validator';

export class CreateChatbotDto {
  @IsString()
  name: string;

  @IsString()
  assistantId: string;

  @IsString()
  instructions: string;

  @IsString()
  model: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  displayName?: string;

  @IsOptional()
  @IsString()
  initialMessage?: string;

  @IsOptional()
  @IsString()
  messagePlaceholder?: string;

  @IsOptional()
  @IsString()
  footer?: string;

  @IsOptional()
  @IsString()
  chatIcon?: string;

  @IsOptional()
  @IsString()
  profileImage?: string;

  @IsOptional()
  @IsString()
  messageColor?: string;

  @IsOptional()
  @IsString()
  align?: Align;

  @IsOptional()
  @IsString()
  theme?: Theme;

  @IsOptional()
  @IsString()
  chatBubbleButtonColor?: string;

  @IsOptional()
  @IsNumber()
  initialMessageShowTime?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  chatSuggestions?: string[];

  @IsOptional()
  @IsString()
  iconMessage?: string;

  @IsOptional()
  @IsString()
  version?: string;

  @IsOptional()
  @IsEnum(Align)
  alignButton?: Align;

  @IsOptional()
  @IsNumber()
  temperature?: number;
}
