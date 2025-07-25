import * as z from 'zod/v4';

export const FindPasswordSchema = z.object({
  id: z.string().min(1, { message: 'ID를 입력해주세요.' }),
  email: z.email({ message: '이메일 형식이 올바르지 않습니다.' }),
});

export type FindPasswordForm = z.infer<typeof FindPasswordSchema>;
