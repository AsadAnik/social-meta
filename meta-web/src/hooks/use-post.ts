import { useState, useEffect } from "react";
import { useFetchPostsQuery } from "@/redux/slice/post.slice";

interface Post {
  _id: string;
  content: string;
  createdAt: string;
  likes_count: number;
  comments_count: number;
  owner: {
    firstname: string;
    lastname: string;
    profilePhoto?: string;
    title: string;
  } | string; // Handle both owner object and string (ID)
}

export function usePosts(page: number, limit: number) {
  const [posts, setPosts] = useState<Post[]>([]);
  const { data, isLoading, error, isFetching, refetch } = useFetchPostsQuery({ page, limit });

  useEffect(() => {
    if (data?.posts?.length) {
      setPosts((prevPosts) => {
        const newPosts = data.posts.filter(
          (newPost) => !prevPosts.some((prevPost) => prevPost._id === newPost._id)
        );
        return [...prevPosts, ...newPosts] as Post[];
      });
    }
  }, [data]);

  useEffect(() => {
    refetch(); // Ensure API is re-called when page changes
  }, [page, refetch]);

  return {
    posts,
    isLoading: isLoading || isFetching,
    error,
    hasMore: Boolean(data?.hasNextPage),
    refetch
  };
}
