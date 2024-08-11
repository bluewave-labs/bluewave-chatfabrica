import { PrismaHealthIndicator } from 'prisma/prisma.health';
import { Injectable } from '@nestjs/common';
import { HealthCheckService, MemoryHealthIndicator } from '@nestjs/terminus';

@Injectable()
export class HealthService {
  constructor(
    private health: HealthCheckService,
    private prismaHealth: PrismaHealthIndicator,
    private memoryHealthIndicator: MemoryHealthIndicator,
  ) {}

  check() {
    return this.health.check([
      () => this.prismaHealth.isHealthy('prisma'),
      () =>
        this.memoryHealthIndicator.checkHeap('memory heap', 300 * 1024 * 1024),
    ]);
  }
}
