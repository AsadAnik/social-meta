
import React, { useState, useEffect, useCallback } from 'react';
import { Grid, Paper, Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { readAllPosts } from '../../redux/actions/PostActions';
import { InView } from 'react-intersection-observer';
import debounce from 'lodash/debounce';
import { toast } from 'react-toastify';


import PostHead from '../commons/postHead';
import PostCard from '../commons/PostCard';
import SuggestedFollows from '../commons/SuggestedFollows';
import FriendsBar from '../commons/FriendsBar';
import Footer from '../commons/Footer';
import NotFound from '../widgets/NotFound';

const notFoundColor = 'gray';

const Home = () => {
  const dispatch = useDispatch();

  // Redux state
  const allPosts = useSelector((state) => state.Post.allPosts || []);
  const totalPosts = useSelector((state) => state.Post.total || 0);

  // Local states
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Fetch posts with pagination.
   * @param {number} page - The page number to fetch.
   */
  const fetchPosts = (page) => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    const limit = 5;

    dispatch(readAllPosts(page, limit))
      .then(({ posts, totalPages }) => {
        if (!posts || posts.length === 0) {
          if (page === 1) {
            toast.info('No posts available at the moment!');
          }
          setHasMore(false);
        } else {
          setHasMore(page < totalPages);
          setCurrentPage(page);
        }
      })
      .catch((err) => {
        console.error('Error fetching posts:', err);
        toast.error('Error fetching posts. Please try again later.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  // Debounced function to handle load more functionality
  const handleLoadMore = useCallback(
    debounce(() => {
      if (hasMore && !isLoading) {
        fetchPosts(currentPage + 1);
      }
    }, 300),
    [currentPage, hasMore, isLoading]
  );

  // Fetch initial posts when component mounts
  useEffect(() => {
    if (allPosts.length === 0 && !isLoading && !hasMore) {
      toast.info('No posts available at the moment!');
    }
  }, [allPosts, isLoading, hasMore]);// eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Render posts or "No Posts Found" message.
   * @param {Array} posts - Array of posts to render.
   * @returns {JSX.Element}
   */
  const renderPosts = (posts) => {
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
      </>
    );
  };

  return (
    <div>
      <Container>
        <Grid container spacing={2}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Paper>
              <PostHead />
            </Paper>
            {renderPosts(allPosts)}

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

            {/* No More Posts Message */}
            {!hasMore && allPosts.length > 0 && (
              <p style={{ textAlign: 'center', marginTop: '1rem', color: 'gray' }}>
                No more posts remain.
              </p>
            )}
          </Grid>

          {/* Sidebar Content */}
          <Grid item xs={12} md={4} style={{ marginTop: '2rem' }}>
            <FriendsBar />
            <SuggestedFollows />
            <Footer />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default React.memo(Home);
