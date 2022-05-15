import { SetMetadata } from '@nestjs/common';
import { Role } from './role.enum';

export const ROLE_KEY = 'role';
export const WithRole = (role = Role.User) => SetMetadata(ROLE_KEY, role);
