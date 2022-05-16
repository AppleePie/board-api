import { User } from '../auth/types';

export type FormData = any;

export type Request = {
  user: User;
  body: FormData;
};
