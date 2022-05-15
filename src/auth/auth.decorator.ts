import { applyDecorators, UseGuards } from '@nestjs/common';
import { RolesGuard } from './roles/roles.guard';
import { WithRole } from './roles/roles.decorator';
import { JwtAuthGuard } from './jwt.auth';
import { Role } from './roles/role.enum';

export function Auth(role?: Role) {
  return applyDecorators(WithRole(role), UseGuards(JwtAuthGuard, RolesGuard));
}
