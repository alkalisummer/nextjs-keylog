'use client';

import { useRouter } from 'next/navigation';
import { deleteImg, deletePost } from '../api';
import { queryKey } from '@/app/provider/query/lib';
import { useMutation, useQueryClient, QueryKey } from '@tanstack/react-query';

interface Props {
  postQueryKey: QueryKey;
  userId: string;
  imgFileArr: string[];
}

export const useDeletePost = ({ postQueryKey, userId, imgFileArr }: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const recentPostQueryKey = queryKey().post().recentPost(userId);
  const popularPostQueryKey = queryKey().post().popularPost(userId);

  const { mutate: deletePostMutation } = useMutation({
    mutationFn: (postId: number) => deletePost(postId),
    onMutate: (postId: number) => {
      const prev = queryClient.getQueryData(postQueryKey);
      queryClient.setQueryData(postQueryKey, (old: any) => {
        return old.filter((post: any) => post.id !== postId);
      });
      return { prev };
    },
    onError: (err, _, context) => {
      console.log(err, context);
      if (context?.prev) {
        queryClient.setQueryData(postQueryKey, context.prev);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postQueryKey });
      queryClient.invalidateQueries({ queryKey: recentPostQueryKey });
      queryClient.invalidateQueries({ queryKey: popularPostQueryKey });
      deleteImg(imgFileArr);
      router.push(`/${userId}`);
    },
  });
  return { deletePostMutation };
};
