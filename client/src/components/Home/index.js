import React, { useState, useEffect, useCallback } from 'react';
import { Grid, Paper, Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { readAllPosts } from '../../redux/actions/PostActions';
import { InView } from 'react-intersection-observer';
import debounce from 'lodash/debounce';

import PostHead from '../commons/postHead';
import PostCard from '../commons/PostCard';
import SuggestedFollows from '../commons/SuggestedFollows';
import FriendsBar from '../commons/FriendsBar';
import Footer from '../commons/Footer';
import NotFound from '../widgets/NotFound';

const notFoundColor = 'gray';

const Home = () => {
    const dispatch = useDispatch();
    const allPosts = useSelector((state) => state.Post.allPosts);
    const totalPosts = useSelector((state) => state.Post.total);

    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    // Debounced method to handle scrolling
    const handleLoadMore = useCallback(
        debounce(() => {
            if (hasMore && !isLoading) {
                fetchPosts(currentPage + 1);
            }
        }, 300),
        [currentPage, hasMore, isLoading]
    );

    // Function to fetch posts with pagination
    const fetchPosts = (page) => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);
        const limit = 5;

        dispatch(readAllPosts(page, limit))
            .then(({ posts, total, totalPages }) => {
                if (!posts || posts.length === 0) {
                    setHasMore(false); // No more posts
                } else {
                    setHasMore(page < totalPages);
                    setCurrentPage(page);
                }
                setIsLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching posts:', err);
                setIsLoading(false);
            });
    };

    // Fetch initial posts on component mount
    useEffect(() => {
        fetchPosts(currentPage);
    }, []);

    // Function to display posts, or show "Not Found" if there are no posts
    const showAllPosts = (posts) => {
        if (!Array.isArray(posts) || posts.length === 0) {
            return <NotFound msg="No Posts Found!" color={notFoundColor} size={100} />;
        }

        return (
            <>
                {posts.map((post) => {
                    const owner = post.ownerId; 

                    return (
                        <PostCard
                            key={post._id}
                            postType="HOME"
                            postId={post._id}
                            ownerId={owner?._id}
                            ownerTitle={owner?.title}
                            ownerName={`${owner?.firstname || ''} ${owner?.lastname || ''}`}
                            ownerProfilePhoto={owner?.profilePhoto}
                            postBody={post.body}
                            postImage={post.image}
                            createdAt={post.createdAt}
                            updatedAt={post.updatedAt}
                            postLikes={post.likes || 0}
                            comments={post.comments}
                        />
                    );
                })}
                {!hasMore && posts.length > 0 && (
                    <p style={{ textAlign: 'center', marginTop: '1rem', color: 'gray' }}>
                        No more posts remain.
                    </p>
                )}
            </>
        );
    };

    return (
        <div>
            <Container>
                <Grid container spacing={2}>
                    {/* Main content area */}
                    <Grid item xs={12} md={8}>
                        <Paper>
                            <PostHead />
                        </Paper>
                    </Grid>

                    {/* Sidebar */}
                    <Grid item xs={12} md={4} style={{ marginTop: '2rem' }}>
                        <FriendsBar />
                    </Grid>

                    {/* Posts Display Area */}
                    <Grid item xs={12} md={8}>
                        {/* Concatenate newly fetched posts */}
                        {showAllPosts(allPosts || [])}

                        {/* Infinite Scroll Trigger */}
                        {hasMore && allPosts.length > 0 && (
                            <InView
                                as="div"
                                threshold={0.5}
                                onChange={(inView) => {
                                    if (inView && !isLoading) {
                                        handleLoadMore();
                                    }
                                }}
                            >
                                <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                                    {isLoading ? 'Fetching more posts...' : 'Loading more posts...'}
                                </p>
                            </InView>
                        )}

                        {/* No more posts message when all posts are loaded */}
                        {!hasMore && allPosts.length > 0 && (
                            <p style={{ textAlign: 'center', marginTop: '1rem', color: 'gray' }}>
                                No more posts remain.
                            </p>
                        )}
                    </Grid>

                    {/* Sidebar for suggested follows and footer */}
                    <Grid item xs={12} md={4}>
                        <SuggestedFollows />
                        <Footer />
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default React.memo(Home);
