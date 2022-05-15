import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { LoggerService } from '../../logger/logger.service';
import { User } from '../types';
import { Role } from './role.enum';
import { ROLE_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  public constructor(
    private reflector: Reflector,
    @Inject(LoggerService.diKey) private readonly logger: LoggerService,
  ) {}

  public canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride<Role>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRole) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<{ user: User }>();
    const isAvailableForUser =
      user.role === Role.Administrator || user.role === requiredRole;

    if (!isAvailableForUser) {
      this.logger.warn(
        `User's ('${user.login}') role '${user.role}' not a required '${requiredRole}'`,
      );
    }

    return isAvailableForUser;
  }
}
