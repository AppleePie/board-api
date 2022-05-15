import { Role } from 'src/auth/roles/role.enum';

export type JwtPayload = {
  sub: Role; // role
  username: string; // login
};

export type User = {
  role: Role;
  login: string;
};

export type Request = { user: User };
