import { Global, Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthService } from './health.service';
import { PrismaService } from 'prisma/prisma.service';
import { HealthController } from './health.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Global()
@Module({
  imports: [TerminusModule, PrismaModule],
  providers: [HealthService],
  exports: [HealthService],
  controllers: [HealthController],
})
export class HealthModule {}
