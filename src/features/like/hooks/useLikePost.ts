'use client';

import { useSession } from 'next-auth/react';
import { likePost, unlikePost } from '../api';
import { LikeRes } from '@/entities/like/model';
import { getLikeCnt } from '@/entities/like/api';
import { queryKey } from '@/app/provider/query/lib';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useLikePost = (postId: number) => {
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();
  const userId = session?.user?.id ?? '';

  const postLikeQueryKey = queryKey().like().likeCnt(postId);

  const { data: likeRes } = useQuery({
    queryKey: postLikeQueryKey,
    queryFn: () => getLikeCnt(postId),
    enabled: status === 'authenticated',
  });

  const isLiked = likeRes?.ok && likeRes.data.items.some(like => like.userId === userId);
  const likeCnt = likeRes?.ok ? likeRes.data.totalItems : 0;

  const { mutate: like } = useMutation({
    mutationFn: () => likePost({ postId, userId }),
    onMutate: () => {
      queryClient.cancelQueries({ queryKey: postLikeQueryKey });
      const prev = queryClient.getQueryData(postLikeQueryKey);
      queryClient.setQueryData(postLikeQueryKey, (old: LikeRes) => {
        return {
          ok: true,
          data: {
            totalItems: old.totalItems + 1,
            items: [...old.items, { userId, likeCnt: old.totalItems + 1 }],
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
    onMutate: () => {
      queryClient.cancelQueries({ queryKey: postLikeQueryKey });
      const prev = queryClient.getQueryData(postLikeQueryKey);
      queryClient.setQueryData(postLikeQueryKey, (old: LikeRes) => {
        return {
          ok: true,
          data: {
            totalItems: old.totalItems - 1,
            items: old.items.filter(like => like.userId !== userId),
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
