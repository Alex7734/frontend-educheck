import { z } from 'zod';

const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  age: z.number().int(),
  hasWeb3Access: z.boolean().optional()
});

export type TUser = z.infer<typeof userSchema>;
