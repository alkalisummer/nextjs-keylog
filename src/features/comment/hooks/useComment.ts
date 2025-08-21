'use client';

import { useSession } from 'next-auth/react';
import { ApiResponse } from '@/shared/lib/client';
import { queryKey } from '@/app/provider/query/lib';
import { createComment as createTempComment } from '../lib';
import { Comment, CommentRes } from '@/entities/comment/model';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createComment, updateComment, deleteComment } from '../api';
import { CreateCommentForm, UpdateCommentForm, DeleteCommentForm } from '../model';

interface UseCommentProps {
  postId: number;
  onSuccess?: () => void;
}

export const useComment = ({ postId, onSuccess }: UseCommentProps) => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const commentListQueryKey = queryKey().comment().commentList(postId);

  const createCommentMutation = useMutation({
    mutationFn: (data: CreateCommentForm) => createComment(data),
    onMutate: async data => {
      await queryClient.cancelQueries({ queryKey: commentListQueryKey });

      const prev = queryClient.getQueryData<ApiResponse<CommentRes>>(commentListQueryKey);
      const prevData = prev?.data || { totalItems: 0, items: [] };

      const tempComment: Comment = createTempComment({
        postId: data.postId,
        content: data.content,
        authorId: session?.user?.id,
        authorName: session?.user?.name ?? '',
        authorImage: session?.user?.image ?? '',
        commentOriginId: data.commentOriginId,
      });

      queryClient.setQueryData(commentListQueryKey, {
        ok: true,
        status: 200,
        data: {
          totalItems: prevData.totalItems + 1,
          items: [...prevData.items, tempComment],
        },
      });

      return { prev };
    },
    onError: (_, __, context) => {
      if (context?.prev) {
        queryClient.setQueryData(commentListQueryKey, context.prev);
      }
      alert('댓글 작성 중 오류가 발생했습니다.');
    },
    onSuccess: res => {
      if (res.ok) {
        onSuccess?.();
      } else {
        alert(res.error || '댓글 작성에 실패했습니다. 다시 시도해주세요.');
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: commentListQueryKey });
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: (data: UpdateCommentForm) => updateComment({ ...data, postId }),
    onMutate: async data => {
      await queryClient.cancelQueries({ queryKey: commentListQueryKey });

      const prev = queryClient.getQueryData<ApiResponse<CommentRes>>(commentListQueryKey);
      const prevData = prev?.data || { totalItems: 0, items: [] };

      // 댓글 업데이트
      const updatedItems = prevData.items.map(comment =>
        comment.commentId === data.commentId ? { ...comment, commentCntn: data.content } : comment,
      );

      queryClient.setQueryData(commentListQueryKey, {
        ok: true,
        status: 200,
        data: {
          totalItems: prevData.totalItems,
          items: updatedItems,
        },
      });

      return { prev };
    },
    onError: (_, __, context) => {
      if (context?.prev) {
        queryClient.setQueryData(commentListQueryKey, context.prev);
      }
      alert('댓글 수정 중 오류가 발생했습니다.');
    },
    onSuccess: res => {
      if (res.ok) {
        onSuccess?.();
      } else {
        alert(res.error || '댓글 수정에 실패했습니다.');
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: commentListQueryKey });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (data: DeleteCommentForm) => deleteComment({ ...data, postId }),
    onMutate: async data => {
      await queryClient.cancelQueries({ queryKey: commentListQueryKey });

      const prev = queryClient.getQueryData<ApiResponse<CommentRes>>(commentListQueryKey);
      const prevData = prev?.data || { totalItems: 0, items: [] };

      // 댓글 삭제
      const filteredItems = prevData.items.filter(comment => comment.commentId !== data.commentId);

      // 답글인 경우, 부모 댓글의 replyCnt 감소
      let updatedItems = filteredItems;
      if (data.commentOriginId) {
        updatedItems = filteredItems.map(comment =>
          comment.commentId === data.commentOriginId
            ? { ...comment, replyCnt: Math.max(0, comment.replyCnt - 1) }
            : comment,
        );
      }

      queryClient.setQueryData(commentListQueryKey, {
        ok: true,
        status: 200,
        data: {
          totalItems: prevData.totalItems - 1,
          items: updatedItems,
        },
      });

      return { prev };
    },
    onError: (_, __, context) => {
      if (context?.prev) {
        queryClient.setQueryData(commentListQueryKey, context.prev);
      }
      alert('댓글 삭제 중 오류가 발생했습니다.');
    },
    onSuccess: res => {
      if (res.ok) {
        onSuccess?.();
      } else {
        alert(res.error || '댓글 삭제에 실패했습니다.');
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: commentListQueryKey });
    },
  });

  return {
    create: {
      mutate: createCommentMutation.mutate,
      isPending: createCommentMutation.isPending,
    },
    update: {
      mutate: updateCommentMutation.mutate,
      isPending: updateCommentMutation.isPending,
    },
    delete: {
      mutate: deleteCommentMutation.mutate,
      isPending: deleteCommentMutation.isPending,
    },
  };
};
