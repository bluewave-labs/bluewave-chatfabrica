import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/auth.guard';

export function Auth() {
  return applyDecorators(
    UseGuards(AuthGuard),
    // ApiBearerAuth(),
    // ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
