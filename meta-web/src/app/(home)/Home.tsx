"use client";

import { useEffect, useState } from "react";
import { TweetCard } from "@/components/common";
import CreateInput from "@/components/common/CreateInput";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import TweetCardSkeleton from "@/components/widgets/CardSkeletion";
import { NotFound } from "@/components/widgets";
import { useFetchPostsQuery } from "@/redux/slice/post.slice";

interface Post {
  content: string;
  _id: string;
  body: string;
  createdAt: string;
  likes_count: number;
  dislikes_count: number;
  comments_count: number;
  image: string; 
  owner: {
    _id: string;
    firstname: string;
    lastname: string;
    profilePhoto?: string;
    title: string;
  };
}

const Home = () => {
  const [page, setPage] = useState<number>(1);
  const [accumulatedPosts, setAccumulatedPosts] = useState<Post[]>([]);

  // Fetch posts using RTK Query for the current page
  const { data, isLoading, error, refetch } = useFetchPostsQuery({ page, limit: 5 });

  // Extract hasNextPage from the query result
  const hasMore = data?.hasNextPage ?? false;

  useEffect(() => {
    if (data && data.posts) {
      if (page === 1) {
        setAccumulatedPosts(data.posts as unknown as Post[]);
      } else {
        setAccumulatedPosts((prevPosts) => {
          const newPosts = (data.posts as unknown as Post[]).filter(
            (post) => !prevPosts.some((prevPost) => prevPost._id === post._id)
          );
          return [...prevPosts, ...newPosts];
        });
      }
    }
  }, [data, page]);
  const loadMorePosts = () => {
    if (hasMore && !isLoading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const { loaderRef } = useInfiniteScroll(loadMorePosts, hasMore, isLoading);

  //region  Optionally, refresh posts when a new post is created.
  const refreshPosts = async () => {
    setPage(1);
    setAccumulatedPosts([]); 
    await refetch();
  };

  if (error) {
    const errorMessage =
      error && typeof error === "object" && "data" in (error as any)
        ? ((error as any).data as { message: string }).message
        : "Something went wrong!";
    return <NotFound label={`Failed to load posts: ${errorMessage}`} />;
  }

  return (
    <div className="tweets-area">
      <CreateInput userProfileImage="https://via.placeholder.com/150" onPostCreated={refreshPosts} />

      {accumulatedPosts.length > 0 ? (
        accumulatedPosts.map((post: Post) => <TweetCard key={post._id} post={{ ...post, content: post.content || '', owner: { ...post.owner, _id: post.owner._id || '' } }} />)
      ) : (
        !isLoading && <NotFound label="No Post available" />
      )}

      {isLoading &&
        Array.from({ length: 3 }).map((_, index) => <TweetCardSkeleton key={index} />)}

      <div ref={loaderRef} className="min-h-[50px]" />
    </div>
  );
};

export default Home;
