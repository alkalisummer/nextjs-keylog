'use server';

import { client } from '@/shared/lib/client';
import { CommentMutationResponse } from '../model/type';
import { DeleteCommentForm, DeleteCommentSchema } from '../model/schema';

export const deleteComment = async (data: DeleteCommentForm & { postId: number }): Promise<CommentMutationResponse> => {
  const validation = await DeleteCommentSchema.safeParseAsync(data);

  if (!validation.success) {
    return {
      ok: false,
      status: 400,
      error: '댓글 삭제에 실패하였습니다.',
    };
  }

  const res = await client.comment().delete({
    endpoint: `/${validation.data.commentId}`,
    options: {
      searchParams: {
        postId: data.postId,
      },
    },
  });

  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      error: res.error || '댓글 삭제에 실패하였습니다.',
    };
  }

  return {
    ok: true,
    status: res.status,
    data: res.data as { commentId: number; message?: string },
  };
};
