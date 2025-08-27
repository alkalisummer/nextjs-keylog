import * as z from 'zod/v4';

export const PostSchema = z.object({
  title: z.string().min(1, { message: '제목을 입력해주세요.' }),
  content: z.string().optional(),
  hashtags: z.array(z.string()).optional(),
});

export type PostForm = z.infer<typeof PostSchema>;
