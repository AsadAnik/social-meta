"use client";
import { useEffect, useState } from "react";
import { TweetCard } from "@/components/common";
import CreateInput from "@/components/common/CreateInput";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import TweetCardSkeleton from "@/components/widgets/CardSkeletion";
import { NotFound } from "@/components/widgets";
import { useFetchPostsQuery } from "@/redux/slice/post.slice";
import { IPost } from '@/shared/types';


// region HOME COMPONENT
const Home = () => {
    const [page, setPage] = useState<number>(1);
    const [accumulatedPosts, setAccumulatedPosts] = useState<IPost[]>([]);

    // Fetch posts using RTK Query for the current page
    // Use isFetching to track loading state for all requests
    const { data, isLoading, isFetching, error, refetch } = useFetchPostsQuery({page, limit: 5});

    // Extract hasNextPage from the query result
    const hasMore = data?.hasNextPage ?? false;

    useEffect(() => {
        if (data && data.posts) {
            if (page === 1) {
                setAccumulatedPosts(data.posts as unknown as IPost[]);
            } else {
                // Prevent adding duplicate posts
                setAccumulatedPosts((prevPosts) => {
                    const newPosts = (data.posts as unknown as IPost[]).filter(
                        (post) => !prevPosts.some((prevPost) => prevPost._id === post._id)
                    );
                    return [...prevPosts, ...newPosts];
                });
            }
        }
    }, [data, page]);

    const loadMorePosts = () => {
        // Check hasMore and isFetching to prevent multiple requests
        if (hasMore && !isFetching) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    // Pass isFetching to the infinite scroll hook
    const { loaderRef } = useInfiniteScroll(loadMorePosts, hasMore, isFetching);

    // region Optionally, refresh posts when a new post is created.
    const refreshPosts = async () => {
        setPage(1);
        await refetch();
    };

    if (error) {
        const errorMessage = error && typeof error === "object" && "data" in (error as any)
            ? ((error as any).data as { message: string }).message
            : "Something went wrong!";

        return <NotFound label={`Failed to load posts: ${errorMessage}`}/>;
    }

    // A small improvement: show a loading spinner at the bottom when fetching more pages
    const isFetchingMore = isFetching && page > 1;

    // region Main UI
    return (
        <div className="tweets-area">
            <CreateInput userProfileImage="https://via.placeholder.com/150" onPostCreated={refreshPosts}/>

            {/* ---- THE LOADING FOR UI (Only on initial load) ----- */}
            {isLoading &&
                Array.from({length: 3}).map((_, index) => <TweetCardSkeleton key={index} />)
            }

            {/* ---- THE POST-LISTING AREA AND THE EMPTY STAGE ----- */}
            {accumulatedPosts.length > 0 ? (
                accumulatedPosts.map((post: IPost) => <TweetCard key={post._id} post={{
                    ...post,
                    content: post.content || '',
                    owner: { ...post.owner, _id: post.owner._id || ''}
                }} />)
            ) : (
                !isLoading && <NotFound label="No Post available" />
            )}

            {/* ---- LOADER FOR INFINITE SCROLL ----- */}
            {/* The ref is here, and we can show a spinner when fetching more */}
            <div ref={loaderRef} className="min-h-[50px] flex justify-center items-center">
                {isFetchingMore && <TweetCardSkeleton />}
            </div>
        </div>
    );
};

export default Home;
