import { registerAs } from '@nestjs/config';
import { IsNotEmpty, IsString } from 'class-validator';

import { AIConfig } from './ai-config.type';
import validateConfig from '../utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  @IsNotEmpty()
  OPENAI_API_KEY: string;
}

export default registerAs<AIConfig>('ai', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    apiKey: process.env.OPENAI_API_KEY,
  };
});
