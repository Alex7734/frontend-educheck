import { z } from 'zod';

export const genericSuccessApiResponseSchema = <T extends z.ZodTypeAny>(
  dataSchema: T
) =>
  z.object({
    statusCode: z.number(),
    message: z.string().optional(),
    data: dataSchema
  });

export const genericErrorApiResponseSchema = z.object({
  statusCode: z.number(),
  message: z.string()
});
