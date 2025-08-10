'use client';

import { useRouter } from 'next/navigation';
import { getPost } from '@/entities/post/api';
import { deletePostImage, deletePost } from '../api';
import { queryKey } from '@/app/provider/query/lib';
import { useMutation, useQueryClient, useQuery, QueryKey } from '@tanstack/react-query';
import { parseImgfileArr } from '@/entities/post/lib';
import { ApiResponse } from '@/shared/lib/client';
import { Post } from '@/entities/post/model';
import { useSearchParams } from 'next/navigation';

interface Props {
  postQueryKey: QueryKey;
  userId: string;
  postId: number;
}

export const useDeletePost = ({ postQueryKey, userId, postId }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const postListQueryKey = postQueryKey;
  const recentPostQueryKey = queryKey().post().recentPost(userId);
  const popularPostQueryKey = queryKey().post().popularPost(userId);
  const isTemp = searchParams?.get('tempYn') === 'Y';

  const { data: postRes } = useQuery({
    queryKey: queryKey().post().postDetail(postId),
    queryFn: () => getPost(postId),
  });

  const postHtmlCntn = (postRes?.ok && postRes.data?.postHtmlCntn) || '';
  const imgFiles = parseImgfileArr(Buffer.from(postHtmlCntn).toString());

  const { mutate: deletePostMutation } = useMutation({
    mutationFn: () => deletePost(postId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: postListQueryKey });

      const prevData = queryClient.getQueryData<ApiResponse<Post[]>>(postListQueryKey);
      console.log('onMutate - previous data:', prevData);

      const prevPosts = prevData?.data || [];
      const filteredPosts = prevPosts.filter((post: Post) => post.postId !== postId);

      const optimisticData = {
        ok: true,
        status: 200,
        data: filteredPosts,
      };

      queryClient.setQueryData(postListQueryKey, optimisticData);

      return { prev: prevData };
    },
    onError: (err, _, context) => {
      console.log(err, context);
      if (context?.prev) {
        queryClient.setQueryData(postListQueryKey, context.prev);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postListQueryKey });
      queryClient.invalidateQueries({ queryKey: recentPostQueryKey });
      queryClient.invalidateQueries({ queryKey: popularPostQueryKey });
      deletePostImage(imgFiles);
      !isTemp && router.push(`/${userId}`);
    },
  });
  return { deletePostMutation };
};
