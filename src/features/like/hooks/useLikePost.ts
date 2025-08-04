'use client';

import { useSession } from 'next-auth/react';
import { likePost, unlikePost } from '../api';
import { LikeRes } from '@/entities/like/model';
import { getLikeCnt } from '@/entities/like/api';
import { ApiResponse } from '@/shared/lib/client';
import { queryKey } from '@/app/provider/query/lib';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useLikePost = (postId: number) => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userId = session?.user?.id ?? '';

  const postLikeQueryKey = queryKey().like().likeCnt(postId);

  const { data: likeRes } = useQuery({
    queryKey: postLikeQueryKey,
    queryFn: () => getLikeCnt(postId),
  });

  const isLiked = likeRes?.ok && likeRes.data.items.some(like => like.userId === userId);
  const likeCnt = likeRes?.ok ? likeRes.data.totalItems : 0;

  const { mutate: like } = useMutation({
    mutationFn: () => likePost({ postId, userId }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: postLikeQueryKey });
      const prev = queryClient.getQueryData<ApiResponse<LikeRes>>(postLikeQueryKey)?.data || {
        totalItems: 0,
        items: [],
      };
      queryClient.setQueryData(postLikeQueryKey, () => {
        return {
          ok: true,
          status: 200,
          data: {
            totalItems: prev.totalItems + 1,
            items: [...prev.items, { userId, likeCnt: prev.totalItems + 1 }],
          },
        };
      });
      return { prev };
    },
    onError: (_, __, context) => {
      if (context?.prev) {
        queryClient.setQueryData(postLikeQueryKey, context.prev);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postLikeQueryKey });
    },
  });

  const { mutate: unlike } = useMutation({
    mutationFn: () => unlikePost({ postId, userId }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: postLikeQueryKey });
      const prev = queryClient.getQueryData<ApiResponse<LikeRes>>(postLikeQueryKey)?.data ?? {
        totalItems: 0,
        items: [],
      };
      queryClient.setQueryData(postLikeQueryKey, () => {
        return {
          ok: true,
          status: 200,
          data: {
            totalItems: prev.totalItems - 1,
            items: prev.items.filter(like => like.userId !== userId),
          },
        };
      });
      return { prev };
    },
    onError: (_, __, context) => {
      if (context?.prev) {
        queryClient.setQueryData(postLikeQueryKey, context.prev);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postLikeQueryKey });
    },
  });

  return { isLiked, likeCnt, like, unlike };
};
