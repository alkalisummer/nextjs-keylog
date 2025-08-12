import * as z from 'zod/v4';

export const ImageFormSchema = z.object({
  image: z.instanceof(File).refine(
    file => {
      return file.size < 20 * 1024 * 1024;
    },
    {
      message: '이미지 파일 크기는 20MB 이하여야 합니다.',
    },
  ),
});

export type ImageForm = z.infer<typeof ImageFormSchema>;

export const ProfileFormSchema = z.object({
  nickname: z.string().trim().min(1, { message: '닉네임을 입력해주세요.' }),
  blogName: z.string().trim().min(1, { message: '블로그 이름을 입력해주세요.' }),
});

export type ProfileForm = z.infer<typeof ProfileFormSchema>;

export const EmailFormSchema = z.object({
  email: z.email({ message: '이메일 형식이 올바르지 않습니다.' }),
});

export type EmailForm = z.infer<typeof EmailFormSchema>;
