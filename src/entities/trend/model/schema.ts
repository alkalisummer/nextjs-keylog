import * as z from 'zod/v4';

export const SearchImageSchema = z.object({
  keyword: z.string().trim().min(1),
});

export type SearchImageForm = z.infer<typeof SearchImageSchema>;
