import { PartialType } from '@nestjs/mapped-types';
import { CreateChatlogDto } from './create-chatlog.dto';

export class UpdateChatlogDto extends PartialType(CreateChatlogDto) {}
