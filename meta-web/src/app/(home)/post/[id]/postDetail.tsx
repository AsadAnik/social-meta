'use client';

import { useParams } from 'next/navigation';
import { useFetchPostQuery } from '@/redux/slice/post.slice';
import { NotFound } from '@/components/widgets';
import { TweetCard } from '@/components/common';
import TweetCardSkeleton from '@/components/widgets/CardSkeletion';
import CommentsSection from '@/components/CommentSection'; // Uncommented

const PostDetail = () => {
  const { id } = useParams();
  const postId = Array.isArray(id) ? id[0] : id;

  if (!postId) return <NotFound label="Invalid post ID." />;

  const { data, isLoading, error } = useFetchPostQuery(postId);

  if (isLoading) return <TweetCardSkeleton />;
  if (error || !data?.post) return <NotFound label="Post not found or failed to load." />;

  const post = data.post;

  return (
    <div className="post-detail-area p-4">
      <TweetCard
        post={{
          _id: post._id,
          content: post.content || '',
          createdAt: post.createdAt,
          comments_count: post.comments_count ?? 0,
          likes_count: post.likes_count ?? 0,
          dislikes_count: 0,
          owner: post.user
            ? {
                _id: post.user._id,
                firstname: post.user.firstname,
                lastname: post.user.lastname,
                profilePhoto: post.user.profilePhoto || '',
                title: post.user.title || '',
              }
            : {
                _id: post.ownerId,
                firstname: 'Unknown',
                lastname: '',
                profilePhoto: '',
                title: '',
              },
        }}
      />

      {/* Render the CommentSection with the required props */}
      <CommentsSection
        postId={post._id}
        initialComments={post.comments || []}
        totalComments={post.comments_count ?? 0}
      />
    </div>
  );
};

export default PostDetail;
