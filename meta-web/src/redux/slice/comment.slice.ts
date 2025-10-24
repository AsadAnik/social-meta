import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosInstance } from '@/lib';
import { postsApi } from './post.slice';
import { socket } from '@/lib/socket';

// Define the type for a comment
interface Comment {
  comment: any;
  success: any;
  _id: string;
  postId: string;
  text: string;
  user: any; // Can be a user object
  createdAt: string;
}

// Define the type for the slice state
interface CommentState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
}

// Initial state for the comments
const initialState: CommentState = {
  comments: [],
  loading: false,
  error: null,
};

const customBaseQuery = async ({ url, method, body }: any) => {
  try {
    const result = await axiosInstance({ url, method, data: body });
    return { data: result.data };
  } catch (error: unknown) {
    console.error("🚨 API Error:", error);
    if (axios.isAxiosError(error)) {
      return {
        error: {
          status: error.response?.status || 500,
          data: error.response?.data || 'Server error',
        },
      };
    }
    return { error: { status: 500, data: 'Network error: Server unreachable' } };
  }
};

// RTK Query API definition for comments
export const commentsApi = createApi({
  reducerPath: 'commentsApi',
  baseQuery: customBaseQuery,
  tagTypes: ['Comment'],
  endpoints: (builder) => ({
    fetchComments: builder.query<Comment[], string>({
      query: (postId) => `/comments/${postId}`,
      providesTags: (result, error, postId) => [{ type: 'Comment', id: postId }],
    }),
    addComment: builder.mutation<{ comment: Comment }, { postId: string; comment: string }>({
      query: ({ postId, comment }) => ({
        url: `/comments/`,
        method: 'POST',
        body: { postId, comment },
      }),
      async onQueryStarted({ postId, comment }, { dispatch, queryFulfilled }) {
        const tempId = `temp_${Date.now()}`;
        const tempComment = {
          _id: tempId,
          comment,
          postId,
          user: { name: 'You' }, // Placeholder for optimistic update
          createdAt: new Date().toISOString(),
        };

        // Optimistically update the list of posts (e.g., on the home feed)
        const postsListPatch = dispatch(
          postsApi.util.updateQueryData('fetchPosts', { page: 1, limit: 5 }, (draft) => {
            const post = draft.posts.find((p) => p._id === postId);
            if (post) {
              post.comments.push(tempComment as any);
              post.comments_count = (post.comments_count ?? 0) + 1;
            }
          })
        );

        // Optimistically update the single post view
        const postDetailPatch = dispatch(
          postsApi.util.updateQueryData('fetchPost', postId, (draft) => {
            if (draft.post) {
              draft.post.comments.push(tempComment as any);
              draft.post.comments_count = (draft.post.comments_count ?? 0) + 1;
            }
          })
        );

        try {
          const { data } = await queryFulfilled;
          // Invalidate comments for the post to refetch and get the real comment from the server
          dispatch(commentsApi.util.invalidateTags([{ type: 'Comment', id: postId }]));

          // Emit real-time update after successful API call
          socket.emit('comment', { postId, comment: data.comment });
        } catch (error) {
          console.error('Error adding comment:', error);
          // If the API call fails, undo both optimistic updates
          postsListPatch.undo();
          postDetailPatch.undo();
        }
      },
    }),
  }),
});

// Export the auto-generated hooks for these endpoints
export const { useFetchCommentsQuery, useAddCommentMutation } = commentsApi;

// Create a slice for managing local state (optional, if you need to manage local state)
const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
});

export default commentSlice.reducer;
