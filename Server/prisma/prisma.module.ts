import { Module } from '@nestjs/common';

import { PrismaService } from './prisma.service';
import { PrismaHealthIndicator } from './prisma.health';

@Module({
  imports: [],
  exports: [PrismaService, PrismaHealthIndicator],
  providers: [PrismaService, PrismaHealthIndicator],
})
export class PrismaModule {}
