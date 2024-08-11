import { Module, forwardRef } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [PrismaService, UserService],
  exports: [],
})
export class UserModule {}
