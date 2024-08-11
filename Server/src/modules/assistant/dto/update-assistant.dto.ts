import { PartialType } from '@nestjs/mapped-types';
import { CreateAssistantDto } from './create-assistant.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Visibility } from '@prisma/client';

export class UpdateAssistantDto extends PartialType(CreateAssistantDto) {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  model?: string;

  @IsString()
  @IsOptional()
  visibility?: Visibility;

  @IsNumber()
  @IsOptional()
  temperature?: number;
}
