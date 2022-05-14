import { Role } from 'src/roles/role.enum';

export type JwtPayload = {
  sub: Role; // role
  username: string; // login
};

export type User = {
  role: Role;
  login: string;
};
