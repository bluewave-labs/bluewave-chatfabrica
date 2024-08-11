import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { Auth } from 'src/common/decorators/auth.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { SubscriptionDto } from './dto/webhook.dto';
import { Request } from 'express';

@Controller('')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Get('plans')
  findAll() {
    return this.planService.findAll();
  }

  @Auth()
  @Get('active-plan')
  findUserActivePlan(@User() user: { sub: string }) {
    return this.planService.findUserActivePlan(user.sub);
  }

  @Auth()
  @Post('plans')
  create(@Body() createPlanDto: CreatePlanDto) {
    return this.planService.create(createPlanDto);
  }

  @Post('webhook')
  cancelPlan(@Req() req: Request) {
    return this.planService.lemonsqueezyWebhook(req.body as SubscriptionDto);
  }

  @Get('plans/check-expired')
  checkFreePlanExpiry() {
    return this.planService.checkFreePlanExpiry();
  }
}
