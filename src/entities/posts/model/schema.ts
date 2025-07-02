import * as z from 'zod/v4';

export const SearchSchema = z.object({
  searchWord: z
    .string()
    .min(1, { message: '검색어를 입력해주세요.' })
    .max(100, { message: '검색어는 100자 이하로 입력해주세요.' }),
});

export type SearchForm = z.infer<typeof SearchSchema>;
