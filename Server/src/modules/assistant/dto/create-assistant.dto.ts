import { IsOptional, IsString } from 'class-validator';

export class CreateAssistantDto {
  @IsString()
  @IsOptional()
  userId?: string;
}
