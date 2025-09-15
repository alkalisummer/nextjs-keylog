'use client';

import { getPost } from '@/entities/post/api';
import { createPost, updatePost } from '../api';
import { ApiResponse } from '@/shared/lib/client';
import { queryKey } from '@/app/provider/query/lib';
import { deletePostImage, deletePost } from '../api';
import { parseImgfileArr } from '@/entities/post/lib';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQueryClient, QueryKey } from '@tanstack/react-query';
import { CreatePostInput, UpdatePostInput, Post } from '@/entities/post/model';

interface UsePostOptions {
  update?: { postId: number; authorId: string };
  delete?: { postQueryKey: QueryKey; userId: string; postId: number };
}

export function usePost(options?: UsePostOptions) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  // Create
  const createPostMutation = useMutation({
    mutationFn: (data: CreatePostInput) => createPost(data),
    onSuccess: async (response, variables) => {
      if (response.ok) {
        const { authorId, postId } = response.data;

        await queryClient.invalidateQueries({
          queryKey: queryKey().post().postList({ authorId, tempYn: variables.tempYn }),
        });

        queryClient.invalidateQueries({
          queryKey: queryKey().post().postList({ currPageNum: 1 }),
        });

        alert(variables.tempYn === 'Y' ? '임시 저장이 완료되었습니다.' : '게시물이 발행되었습니다.');

        if (variables.tempYn === 'N') {
          router.push(`/${authorId}/${postId}`);
        } else {
          router.push(`/${authorId}?tempYn=Y`);
        }
      } else {
        alert('게시물 작성에 실패했습니다.');
      }
    },
    onError: error => {
      console.error('Create post error:', error);
      alert('게시물 작성 중 오류가 발생했습니다.');
    },
  });

  // Update
  const updatePostMutation = useMutation({
    mutationFn: (data: UpdatePostInput) => {
      if (!options?.update) return Promise.reject(new Error('update options are required'));
      return updatePost(options.update.postId, data);
    },
    onSuccess: async (response, variables) => {
      if (!options?.update) return;
      const { postId, authorId } = options.update;

      if (response.ok) {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: queryKey().post().postDetail(postId) }),
          queryClient.invalidateQueries({
            queryKey: queryKey().post().postList({ authorId, tempYn: variables.tempYn }),
          }),
          queryClient.invalidateQueries({ queryKey: queryKey().hashtag().postHashtags(postId) }),
        ]);

        queryClient.invalidateQueries({
          queryKey: queryKey().post().postList({ currPageNum: 1 }),
        }),
          alert(variables.tempYn === 'Y' ? '임시 저장이 완료되었습니다.' : '게시물이 발행되었습니다.');

        if (variables.tempYn === 'N') {
          router.push(`/${authorId}/${postId}`);
        } else {
          router.push(`/${authorId}?tempYn=Y`);
        }
      } else {
        alert('게시물 수정에 실패했습니다.');
      }
    },
    onError: error => {
      console.error('Update post error:', error);
      alert('게시물 수정 중 오류가 발생했습니다.');
    },
  });

  // Delete
  const deletePostMutation = useMutation({
    mutationFn: async () => {
      if (!options?.delete) throw new Error('delete options are required');
      const { postId } = options.delete;

      // 게시물 이미지 삭제
      const post = await getPost(postId);
      if (post.ok) {
        const postHtmlCntn = Buffer.from(post.data.postHtmlCntn ?? '').toString();
        const postImageFiles = parseImgfileArr(postHtmlCntn);
        deletePostImage(postImageFiles);
      }

      return deletePost(postId);
    },
    onMutate: async () => {
      if (!options?.delete) return { prev: undefined as ApiResponse<Post[]> | undefined };
      const { postQueryKey } = options.delete;
      await queryClient.cancelQueries({ queryKey: postQueryKey });

      const prevData = queryClient.getQueryData<ApiResponse<Post[]>>(postQueryKey);
      const prevPosts = prevData?.data || [];
      const filteredPosts = prevPosts.filter((post: Post) => post.postId !== options.delete!.postId);

      const optimisticData: ApiResponse<Post[]> = {
        ok: true,
        status: 200,
        data: filteredPosts,
      };

      queryClient.setQueryData(postQueryKey, optimisticData);

      return { prev: prevData };
    },
    onError: (err, _, context) => {
      if (!options?.delete) return;
      const { postQueryKey } = options.delete;
      if (context?.prev) {
        queryClient.setQueryData(postQueryKey, context.prev);
      }
    },
    onSuccess: async () => {
      if (!options?.delete) return;
      const { postQueryKey: listKey, userId } = options.delete;

      const isTemp = searchParams?.get('tempYn') === 'Y';

      queryClient.invalidateQueries({ queryKey: listKey });
      queryClient.invalidateQueries({ queryKey: queryKey().post().recentPost(userId) });
      queryClient.invalidateQueries({ queryKey: queryKey().post().popularPost(userId) });

      !isTemp && router.push(`/${userId}`);
    },
  });

  return {
    createPostMutation,
    updatePostMutation,
    deletePostMutation,
  } as const;
}
