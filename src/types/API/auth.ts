import { TUser } from '@/schemas/user';
import { TTokens } from '@/schemas/auth';

/**
 * Response from the API for the auth endpoints
 */
export type TResponseAuth = {
  user: TUser;
} & TTokens;
