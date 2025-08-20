'use server';

import { isReply } from '../lib';
import { client } from '@/shared/lib/client';
import { CommentMutationResponse } from '../model/type';
import { CreateCommentForm, CreateCommentSchema } from '../model/schema';
import { getCustomSession } from '@/shared/lib/util/auth/server/action';

export const createComment = async (data: CreateCommentForm): Promise<CommentMutationResponse> => {
  const validation = await CreateCommentSchema.safeParseAsync(data);

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
      error: errors.content?.[0] || '댓글 작성에 실패하였습니다.',
    };
  }

  const session = await getCustomSession();
  if (!session?.user?.id) {
    return {
      ok: false,
      status: 401,
      error: '로그인이 필요합니다.',
    };
  }

  // 답글인지 일반 댓글인지 확인
  const endpoint = isReply(validation.data.commentOriginId) ? '/reply' : '';

  const res = await client.comment().post({
    endpoint,
    options: {
      body: {
        postId: validation.data.postId,
        commentCntn: validation.data.content,
        authorId: session.user.id,
        ...(isReply(validation.data.commentOriginId) && { commentOriginId: validation.data.commentOriginId }),
      },
    },
  });

  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      error: res.error || '댓글 작성에 실패하였습니다.',
    };
  }

  return {
    ok: true,
    status: res.status,
    data: res.data as { commentId: number; message?: string },
  };
};
