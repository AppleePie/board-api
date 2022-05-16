import { Role } from 'src/auth/roles/role.enum';

export type JwtPayload = {
  role: Role; // role
  login: string; // login
  username: string;
};

export type User = {
  role: Role;
  login: string;
  name: string;
};

export type Request = { user: User };
