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
