import * as z from 'zod/v4';

export const FindPasswordSchema = z.object({
  id: z.string().trim().min(1, { message: 'ID를 입력해주세요.' }),
  email: z.email({ message: '이메일 형식이 올바르지 않습니다.' }),
});

export type FindPasswordForm = z.infer<typeof FindPasswordSchema>;

export const UpdatePasswordSchema = z
  .object({
    password: z
      .string()
      .trim()
      .min(1, { message: '비밀번호를 입력해주세요.' })
      .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^\w\s])[A-Za-z\d\S]{8,16}$/, {
        message: '비밀번호는 8~16자의 영문 대/소문자, 숫자, 특수문자를 조합하여 입력하세요.',
      }),
    passwordCheck: z.string().trim().min(1, { message: '비밀번호 확인을 입력해주세요.' }),
  })
  .refine(data => data.password === data.passwordCheck, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordCheck'],
  });

export type UpdatePasswordForm = z.infer<typeof UpdatePasswordSchema>;
