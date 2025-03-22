// src/redux/slice/comment.slice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { axiosInstance } from '@/lib';
import { postsApi } from './post.slice';
import { socket } from '@/lib/socket';

// Define the type for a comment
interface Comment {
  comment: any;
  success: any;
  id: string;
  postId: string;
  text: string;
  user: string;
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
          data: error.response?.data || "Server error",
        },
      };
    }

    return { error: { status: 500, data: "Network error: Server unreachable" } };
  }
};


// RTK Query API definition for comments
export const commentsApi = createApi({
  reducerPath: 'commentsApi',
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    getComments: builder.query<Comment[], string>({
      query: (postId) => `/comments/${postId}`,
    }),
    addComment: builder.mutation<Comment, { postId: string; comment: string }>({
      query: ({ postId, comment }) => ({
        url: `/comments/`,
        method: "POST",
        body: { postId, comment }, // Ensure correct data is sent
      }),
      async onQueryStarted({ postId, comment }, { dispatch, queryFulfilled }) {
        const tempComment = {
          id: Date.now().toString(),
          comment,
          postId,
          user: { name: "You" },
          createdAt: new Date().toISOString(),
        };
    
        // Optimistically update UI
        const patchResult = dispatch(
          postsApi.util.updateQueryData("fetchPosts", { page: 1, limit: 5 }, (draft) => {
            const post = draft.posts.find((p) => p.id === postId);
            if (post) {
              post.comments = [...(post.comments || []), tempComment];
            }
          })
        );
    
        try {
          const { data } = await queryFulfilled;
          if (!data.success) throw new Error("Failed to add comment");
    
          // Emit real-time update
          socket.emit("comment", { postId, comment: data.comment });
        } catch (error) {
          console.error("Error adding comment:", error);
          patchResult.undo();
        }
      },    }),    

  }),
});

// Export the auto-generated hooks for these endpoints
export const { useGetCommentsQuery, useAddCommentMutation } = commentsApi;

// Create a slice for managing local state (optional, if you need to manage local state)
const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Optional: handle some local state logic if necessary
  },
});

export default commentSlice.reducer;
