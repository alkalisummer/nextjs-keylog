'use server';

import { client } from '@/shared/lib/client';
import { CommentMutationResponse } from '../model/type';
import { UpdateCommentForm, UpdateCommentSchema } from '../model/schema';

export const updateComment = async (data: UpdateCommentForm & { postId: number }): Promise<CommentMutationResponse> => {
  const validation = await UpdateCommentSchema.safeParseAsync(data);

  if (!validation.success) {
    const errors: Record<string, string[]> = {};
    validation.error.issues.forEach(issue => {
      const field = issue.path[0] as string;
      if (!errors[field]) {
        errors[field] = [];
      }
      errors[field].push(issue.message);
    });

    return {
      ok: false,
      status: 400,
      error: errors.content?.[0] || '댓글 수정에 실패하였습니다.',
    };
  }

  const res = await client.comment().put({
    endpoint: `/${validation.data.commentId}`,
    options: {
      body: {
        commentCntn: validation.data.content,
      },
      searchParams: {
        postId: data.postId,
      },
    },
  });

  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      error: res.error || '댓글 수정에 실패하였습니다.',
    };
  }

  return {
    ok: true,
    status: res.status,
    data: res.data as { commentId: number; message?: string },
  };
};
