import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { PrismaService } from 'prisma/prisma.service';
import {
  Plan,
  PlanType,
  Prisma,
  User,
  UserAction,
  UserPlans,
} from '@prisma/client';
import { SubscriptionDto } from './dto/webhook.dto';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs';
import axios from 'axios';
import * as Sentry from '@sentry/node';
import { MailerService } from '@nestjs-modules/mailer';
import { AllConfigType } from 'src/config/config.type';
import { ConfigService } from '@nestjs/config';

const CANCEL_SUBSCRIPTION_URL = 'https://api.lemonsqueezy.com/v1/subscriptions';
const LEMON_TOKEN = ``;

@Injectable()
export class PlanService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  async create(createPlanDto: CreatePlanDto): Promise<Plan> {
    return this.prisma.plan.create({
      data: createPlanDto,
    });
  }

  async findAll(): Promise<{
    status: string;
    data: Plan[];
  }> {
    const plans = await this.prisma.plan.findMany({
      orderBy: {
        price: 'asc',
      },
      where: {
        isExtraPacket: false,
        isFree: false,
      },
    });

    return {
      status: 'success',
      data: plans,
    };
  }

  async findUserActivePlan(userId: string): Promise<{
    status: string;
    data: UserPlans[];
  }> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        userPlans: {
          orderBy: {
            createdAt: 'desc',
          },
          where: {
            expiresAt: {
              gte: new Date(),
            },
          },
          include: {
            plan: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    if (
      !user.userPlans.length ||
      !user.userPlans.filter(
        (plan) => new Date(plan.expiresAt).getTime() > new Date().getTime(),
      ).length
    ) {
      throw new NotFoundException('User does not have a plan');
    }

    return {
      status: 'success',
      data: user.userPlans,
    };
  }

  async subscribePlan(
    id: string,
    userId: string,
    customerId: number,
    orderId: string,
    subscriptionId: string,
    quantity = 1,
  ): Promise<{
    status: string;
    data: User;
  }> {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id: userId,
        },
        include: {
          userPlans: {
            where: {
              plan: {
                isExtraPacket: false,
              },
              status: true,
              expiresAt: {
                gte: new Date(),
              },
            },
            include: {
              plan: true,
            },
          },
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const plan = await this.prisma.plan.findUnique({
        where: {
          id,
        },
      });

      let totalCredit = 0; // total credits of all active plans
      let totalCreditRemaining = 0; // total remaining credits of all active plans

      user.userPlans.map(async (userPlan) => {
        if (userPlan.expiresAt > new Date()) {
          totalCredit += userPlan.initialMessageCredits;
          totalCreditRemaining += userPlan.currentMessageCredits;
        }
      });

      const updatedUser = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          totalCredits: totalCredit + plan.messageCredits,
          customMessageCredits: totalCreditRemaining + plan.messageCredits,
          eightPercentMail: false,
          ninePercentMail: false,
          creditOverMail: false,
          userPlans: {
            create: {
              plan: {
                connect: {
                  id: plan.id,
                },
              },
              orderId: String(orderId),
              subscriptionId,
              currentChatbotCount: plan.chatbots * quantity,
              currentMessageCredits: plan.messageCredits * quantity,
              initialCharactersPerChatbot: plan.charactersPerChatbot,
              initialChatbotCount: plan.chatbots * quantity,
              initialMessageCredits: plan.messageCredits * quantity,
              price: plan.price * quantity,
              status: true,
              expiresAt:
                plan.type === PlanType.Yearly
                  ? new Date(new Date().setMonth(new Date().getMonth() + 12))
                  : new Date(new Date().setMonth(new Date().getMonth() + 1)),
            },
          },
          customerId,
        },
        include: {
          userPlans: true,
        },
      });

      if (plan.name === 'RemoveBranding') {
        await this.prisma.chatbot.updateMany({
          where: {
            user: {
              id: userId,
            },
          },
          data: {
            includeChatFabricaAttribution: {
              set: false,
            },
          },
        });
      }

      if (!plan.isExtraPacket) {
        for (const userPlan of user.userPlans) {
          if (!userPlan.plan.isFree) {
            try {
              const response = await axios.delete(
                `${CANCEL_SUBSCRIPTION_URL}/${userPlan.subscriptionId}`,
                {
                  headers: {
                    Accept: 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json',
                    Authorization: `Bearer ${LEMON_TOKEN}`,
                  },
                },
              );

              if (response.data) {
                await this.prisma.userPlans.update({
                  where: {
                    id: userPlan.id,
                  },
                  data: {
                    status: false,
                  },
                });
              }
            } catch (error) {
              Sentry.captureException(error);
            }
          } else {
            await this.prisma.userPlans.update({
              where: {
                id: userPlan.id,
              },
              data: {
                status: false,
              },
            });
          }
        }
      }

      this.prisma.userActivity.create({
        data: {
          userId: user.id,
          action: UserAction.PlanSubscribed,
          data: {
            planId: plan.id,
            planName: plan.name,
            planType: plan.type,
            planPrice: plan.price,
            planChatbots: plan.chatbots,
            planMessageCredits: plan.messageCredits,
            planCharactersPerChatbot: plan.charactersPerChatbot,
            planDuration: plan.type === PlanType.Yearly ? 12 : 1,
            userId: user.id,
            customerId,
          },
        },
      });

      const planInfo = {
        name: plan.name,
        price: plan.price,
        chatbots: plan.chatbots,
        messageCredits: plan.messageCredits,
        charactersPerChatbot: plan.charactersPerChatbot,
      };

      await this.prisma.paymentRecord.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          plan: {
            connect: {
              id: plan.id,
            },
          },
          amount: plan.price,
          paymentDate: new Date(),
          planInfo,
        },
      });

      return {
        status: 'success',
        data: updatedUser,
      };
    } catch (error) {
      await this.prisma.userActivity.create({
        data: {
          userId: userId,
          action: UserAction.PlanSubscriptionFailed,
          data: {
            userId: userId,
            customerId: customerId,
            planId: id,
            error,
          },
        },
      });

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Chatlog not found');
        }
      }
      Sentry.captureException(error);
      throw new InternalServerErrorException(error);
    }
  }

  async renewSubscription(body: SubscriptionDto, user: User) {
    try {
      const userPlan = await this.prisma.userPlans.findFirst({
        where: {
          subscriptionId: body.data.id,
        },
        include: {
          plan: true,
        },
      });

      if (!userPlan) {
        throw new NotFoundException('User Plan not found');
      }
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      const targetDate = new Date(body.data.attributes.renews_at);
      targetDate.setHours(0, 0, 0, 0);

      await this.prisma.userPlans.update({
        where: {
          id: userPlan.id,
        },
        data: {
          expiresAt: body.data.attributes.renews_at,
          ...(currentDate >= targetDate && {
            currentMessageCredits: userPlan.plan.messageCredits,
          }),
        },
      });

      await this.prisma.paymentRecord.create({
        data: {
          amount: userPlan.price,
          paymentDate: new Date(),
          planId: userPlan.planId,
          userId: user.id,
          planInfo: {},
        },
      });
    } catch (error) {
      Sentry.captureException(error);
    }
  }

  async expireSubscription(body: SubscriptionDto, user: User) {
    try {
      const userPlan = await this.prisma.userPlans.findFirst({
        where: {
          subscriptionId: body.data.id,
        },
        include: {
          plan: true,
        },
      });

      if (!userPlan) {
        throw new NotFoundException('User Plan not found');
      }

      if (!userPlan.plan.isExtraPacket) {
        const userExtraPlans = await this.prisma.userPlans.findMany({
          where: {
            userId: user.id,
            plan: {
              isExtraPacket: true,
            },
          },
        });

        for (const userExtraPlan of userExtraPlans) {
          this.httpService
            .delete(
              `${CANCEL_SUBSCRIPTION_URL}/${userExtraPlan.subscriptionId}`,
              {
                headers: {
                  Accept: 'application/vnd.api+json',
                  'Content-Type': 'application/vnd.api+json',
                  Authorization: `Bearer ${LEMON_TOKEN}`,
                },
              },
            )
            .pipe(
              map(async () => {
                await this.prisma.userPlans.update({
                  where: {
                    id: userExtraPlan.id,
                  },
                  data: {
                    status: false,
                  },
                });
              }),
            );
        }
      }

      if (userPlan.plan.name === 'RemoveBranding') {
        await this.prisma.chatbot.updateMany({
          where: {
            user: {
              id: user.id,
            },
          },
          data: {
            includeChatFabricaAttribution: {
              set: true,
            },
          },
        });
      }

      await this.prisma.userPlans.update({
        where: {
          id: userPlan.id,
        },
        data: {
          expiresAt: body.data.attributes.renews_at,
          status: false,
        },
      });
    } catch (error) {
      Sentry.captureException(error);
    }
  }

  async cancelSubscription(body: SubscriptionDto, user: User) {
    try {
      const userPlan = await this.prisma.userPlans.findFirst({
        where: {
          subscriptionId: body.data.id,
        },
        include: {
          plan: true,
        },
      });

      if (!userPlan) {
        throw new NotFoundException('User Plan not found');
      }

      await this.prisma.userPlans.update({
        where: {
          id: userPlan.id,
        },
        data: {
          status: false,
        },
      });
    } catch (error) {
      Sentry.captureException(error);
    }
  }

  async lemonsqueezyWebhook(body: SubscriptionDto) {
    const data = body.data;
    const eventType = body.meta.event_name;

    const subscriptionId = data.id;
    const planId = body.meta.custom_data.plan_id;
    const userId = body.meta.custom_data.user_id;
    const quantity = body.meta.custom_data.quantity || 1;
    const customerId = data.attributes.customer_id;
    const orderId = data.attributes.order_id;
    const status = data.attributes.status;

    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id: userId,
        },
        include: {
          userPlans: {
            include: {
              plan: true,
            },
          },
        },
      });

      // Create Subscription
      if (eventType === 'subscription_created') {
        await this.subscribePlan(
          planId,
          user.id,
          customerId,
          orderId,
          subscriptionId,
          Number(quantity),
        );
      }

      // Update Subscription
      if (eventType === 'subscription_updated') {
        if (status === 'active') {
          await this.renewSubscription(body, user);
        } else if (status === 'expired') {
          await this.expireSubscription(body, user);
        } else if (status === 'cancelled') {
          await this.cancelSubscription(body, user);
        }
      }
    } catch (error) {
      Sentry.captureException(error);
      throw new InternalServerErrorException(error);
    }
  }

  async checkCredit(user: User) {
    let totalUserCredit = user.totalCredits;

    const warning80 = totalUserCredit - totalUserCredit * 0.8; // 80% of total credit
    const warning90 = totalUserCredit - totalUserCredit * 0.9; // 90% of total credit

    if (user.customMessageCredits <= 0 && !user.creditOverMail) {
      await this.mailerService
        .sendMail({
          to: user.email,
          subject: 'Your ChatFabrica credit is over.',
          template: './credit-over',
          context: {},
        })
        .catch((error) => {
          Sentry.captureException(error);
        });

      await this.prisma.user.update({
        where: { id: user.id },
        data: { creditOverMail: true },
      });
    } else if (
      user.customMessageCredits <= warning90 &&
      !user.ninePercentMail
    ) {
      await this.mailerService
        .sendMail({
          to: user.email,
          subject: 'Your ChatFabrica credit is running low.',
          template: './credit-warning',
          context: {
            percent: '90',
          },
        })
        .catch((error) => {
          Sentry.captureException(error);
        });

      await this.prisma.user.update({
        where: { id: user.id },
        data: { ninePercentMail: true },
      });
    } else if (
      user.customMessageCredits <= warning80 &&
      !user.eightPercentMail
    ) {
      await this.mailerService
        .sendMail({
          to: user.email,
          subject: 'Your ChatFabrica credit is running low.',
          template: './credit-warning',
          context: {
            percent: '80',
          },
        })
        .catch((error) => {
          Sentry.captureException(error);
        });

      await this.prisma.user.update({
        where: { id: user.id },
        data: { eightPercentMail: true },
      });
    }
  }

  async checkFreePlanExpiry() {
    try {
      const userPlans = await this.prisma.userPlans.findMany({
        where: {
          plan: {
            isFree: true,
          },
        },
        include: {
          plan: {
            select: {
              messageCredits: true,
            },
          },
        },
      });

      for (const userPlan of userPlans) {
        if (new Date(userPlan.expiresAt).getTime() < new Date().getTime()) {
          await this.prisma.userPlans.update({
            where: {
              id: userPlan.id,
            },
            data: {
              currentMessageCredits: userPlan.plan.messageCredits,
              expiresAt: new Date(
                new Date().setMonth(new Date().getMonth() + 1),
              ),
            },
          });
        }
      }

      return {
        status: 'success',
        message: 'Free plan expiry checked',
      };
    } catch (error) {
      Sentry.captureException(error);
      throw new InternalServerErrorException(error);
    }
  }
}
