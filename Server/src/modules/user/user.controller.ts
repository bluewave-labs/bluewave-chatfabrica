import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';

import { UserService } from './user.service';
import { User } from 'src/common/decorators/user.decorator';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Request } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth()
  @Get('analytics')
  getAnalytics(@User() user: { sub: string }) {
    return this.userService.getAnalytics(user.sub);
  }
  @Auth()
  @Post('api-key')
  async updateApiKey(
    @User() user: { sub: string },
    @Body('apiKey') apiKey: string,
  ) {
    await this.userService.updateApiKey(user.sub, apiKey);
    return { message: 'API key updated successfully.' };
  }
}
