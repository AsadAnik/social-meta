'use client';
import { useEffect, useState } from 'react';
import { TweetCard } from '@/components/common';
import CreateInput from '@/components/common/CreateInput';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import TweetCardSkeleton from '@/components/widgets/CardSkeletion';
import { NotFound } from '@/components/widgets';
import { useFetchPostsQuery } from '@/redux/slice/post.slice';
import { IPost } from '@/shared/types';

// region HOME COMPONENT
const Home = () => {
    const [page, setPage] = useState<number>(1);
    const [accumulatedPosts, setAccumulatedPosts] = useState<IPost[]>([]);
    const { data, isLoading, isFetching, error, refetch } = useFetchPostsQuery({ page, limit: 5 });

    const hasMore = data?.hasNextPage ?? false;

    useEffect(() => {
        if (data && data.posts) {
            if (page === 1) {
                setAccumulatedPosts(data.posts as unknown as IPost[]);
            } else {
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
        if (hasMore && !isFetching) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    const { loaderRef } = useInfiniteScroll(loadMorePosts, hasMore, isFetching);

    const refreshPosts = async () => {
        setPage(1);
        await refetch();
    };

    if (error) {
        const errorMessage =
            error && typeof error === 'object' && 'data' in (error as any)
                ? ((error as any).data as { message: string }).message
                : 'Something went wrong!';

        return <NotFound label={`Failed to load posts: ${errorMessage}`}/>;
    }

    const isFetchingMore = isFetching && page > 1;

    // region Main UI
    return (
        <>
            <div className="tweets-area">
                <CreateInput userProfileImage="https://via.placeholder.com/150" onPostCreated={refreshPosts}/>

                {/* Loading Skeletons Initial Posts */}
                {isLoading && Array.from({ length: 3 }).map((_, index) => <TweetCardSkeleton key={index}/>)}

                {accumulatedPosts.length > 0 ? (
                    accumulatedPosts.map((post: IPost) => (
                        <TweetCard
                            key={post._id}
                            post={{
                                ...post,
                                content: post.content || '',
                                owner: { ...post.owner, _id: post.owner._id || '' },
                            }}
                        />
                    ))
                ) : (
                    !isLoading && <NotFound label="No Post available"/>
                )}
            </div>

            {/* Loading Indicator While Loading Post Card */}
            <div ref={loaderRef} className="infinite-loader">
                {isFetchingMore && <TweetCardSkeleton/>}
            </div>
        </>
    );
};

export default Home;
