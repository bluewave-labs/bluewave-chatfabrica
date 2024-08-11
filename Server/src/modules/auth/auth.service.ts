import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { comparePassword, hashPassword } from './utils/pwd-hash';
import { Prisma, UserAction } from '@prisma/client';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import * as Sentry from '@sentry/node';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  async signIn(email: string, pass: string) {
    const existsUser = await this.prisma.user.findFirst({
      where: { email, isActive: true },
    });

    if (!existsUser) {
      throw new NotFoundException('User does not exist');
    }

    const hashedPassword = await comparePassword(pass, existsUser.password);
    if (!hashedPassword) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = {
      sub: existsUser.id,
      email: existsUser.email,
      active: existsUser.isActive,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async createUser(email: string, password: string) {
    try {
      const existPlan = await this.prisma.plan.findFirst({
        where: { isFree: true },
      });

      const user = await this.prisma.user.create({
        data: {
          email,
          password: await hashPassword(password),
          userPlans: {
            create: {
              planId: existPlan.id,
              currentChatbotCount: existPlan.chatbots,
              currentMessageCredits: existPlan.messageCredits,
              initialCharactersPerChatbot: existPlan.charactersPerChatbot,
              initialChatbotCount: existPlan.chatbots,
              initialMessageCredits: existPlan.messageCredits,
              price: existPlan.price,
              expiresAt: new Date(
                new Date().setMonth(new Date().getMonth() + 1),
              ),
            },
          },
        },
      });

      this.mailerService
        .sendMail({
          to: user.email,
          subject: 'Welcome to ChatFabrica',
          template: './welcome',
          context: {},
        })
        .catch((error) => {
          Sentry.captureException(error);
        });

      this.prisma.userActivity.create({
        data: {
          userId: user.id,
          action: UserAction.Signup,
          data: { email: user.email, id: user.id, createdAt: user.createdAt },
        },
      });

      await this.prisma.analytics.create({
        data: {
          user: {
            connect: {
              id: user.id,
            },
          },
          totalCredits: 20,
        },
      });

      return {
        status: 'success',
        message: 'User created successfully',
        user,
      };
    } catch (error) {
      await this.prisma.userActivity.create({
        data: {
          action: UserAction.SignupFailed,
          data: { email, createdAt: new Date(), error },
        },
      });
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          Sentry.captureException(error);
          throw new InternalServerErrorException(error);
        }
      }
      Sentry.captureException(error);
      throw new InternalServerErrorException(error);
    }
  }

  async getUser(id: string) {
    try {
      const currentUser = await this.prisma.user.findFirst({
        where: { id },
        include: {
          userPlans: {
            where: {
              plan: {
                isExtraPacket: false,
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
            include: {
              plan: true,
            },
            take: 1,
          },
        },
      });

      return {
        status: 'success',
        data: currentUser,
      };
    } catch (error) {
      Sentry.captureException(error);
      throw new InternalServerErrorException(error);
    }
  }

  async forgotPassword(email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new NotFoundException('User does not exist');
      }

      const token = await this.jwtService.signAsync({ sub: user.id });

      // send email to user with reset link
      await this.mailerService
        .sendMail({
          to: user.email,
          subject: 'Password Reset',
          template: './forgot',
          context: {
            url: `${this.configService.get('app.frontendDomain', { infer: true })}/auth/reset-password?token=${token}`,
          },
        })
        .catch((error) => {
          Sentry.captureException(error);
        });

      return {
        status: 'success',
        message: 'Password reset link sent to your email',
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2006') {
          Sentry.captureException(error);
          throw new NotFoundException('User does not exist');
        }
      }
      Sentry.captureException(error);
      throw new InternalServerErrorException(error);
    }
  }

  async resetPassword(token: string, password: string) {
    try {
      const decoded = (await this.jwtService.decode(token)) as { sub: string };

      const user = await this.prisma.user.findFirst({
        where: { id: decoded.sub },
      });

      if (!user) {
        throw new NotFoundException('User does not exist');
      }

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          password: await hashPassword(password),
        },
      });

      return {
        status: 'success',
        message: 'Password reset successfully',
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
