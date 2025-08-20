import * as z from 'zod/v4';

export const CreateCommentSchema = z.object({
  postId: z.number().positive(),
  content: z
    .string()
    .trim()
    .min(1, { message: '∙ 댓글 내용을 입력해주세요.' })
    .max(290, { message: '∙ 댓글은 290자까지 작성할 수 있습니다.' }),
  commentOriginId: z.number().optional(), // 답글인 경우
});

export type CreateCommentForm = z.infer<typeof CreateCommentSchema>;

export const UpdateCommentSchema = z.object({
  commentId: z.number().positive(),
  content: z
    .string()
    .trim()
    .min(1, { message: '∙ 댓글 내용을 입력해주세요.' })
    .max(290, { message: '∙ 댓글은 290자까지 작성할 수 있습니다.' }),
});

export type UpdateCommentForm = z.infer<typeof UpdateCommentSchema>;

export const DeleteCommentSchema = z.object({
  commentId: z.number().positive(),
  commentOriginId: z.number().optional(), // 답글 삭제시 부모 댓글 ID
});

export type DeleteCommentForm = z.infer<typeof DeleteCommentSchema>;
