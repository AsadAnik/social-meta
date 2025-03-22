"use client";

import { useParams } from "next/navigation";
import { useFetchPostQuery } from "@/redux/slice/post.slice"; 
import { NotFound } from "@/components/widgets";
import { TweetCard } from "@/components/common";
import TweetCardSkeleton from "@/components/widgets/CardSkeletion";
import CommentsSection from "@/components/CommentSection";

const PostDetail = () => {
    const { id } = useParams();
    const postId = Array.isArray(id) ? id[0] : id;

    if (!postId) return <NotFound label="Invalid post ID." />;

    // ✅ Fetch a single post
    const { data, isLoading, error } = useFetchPostQuery(postId);

    if (isLoading) return <TweetCardSkeleton />;
    if (error || !data?.post) return <NotFound label="Post not found or failed to load." />;

    const post = data.post; // ✅ Correctly extract post from API response

    return (
      <div className="post-detail-area p-4">
        <TweetCard post={{ 
          _id: post._id,
          content: post.content || "",
          createdAt: post.createdAt,
          comments_count: post.comments_count ?? 0, 
          likes_count: post.likes_count ?? 0,
          dislikes_count: 0,
          owner: post.user ? {  // ✅ Use `post.user`
            _id: post.user._id,
            firstname: post.user.firstname,
            lastname: post.user.lastname,
            profilePhoto: post.user.profilePhoto || "",
            title: post.user.title || "",
          } : {
            _id: post.ownerId, // ✅ Fallback in case user data is missing
            firstname: "Unknown",
            lastname: "",
            profilePhoto: "",
            title: "",
          }
        }} />
      </div>
    );
};export default PostDetail;
