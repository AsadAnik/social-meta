import { createApi } from "@reduxjs/toolkit/query/react";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios.interceptor";
import { JSX } from "react";
import { io } from "socket.io-client";
import { url } from "inspector";
import { UserInfo } from "os";

// Initialize WebSocket Connection
const socket = io("http://localhost:8080"!, {
  withCredentials: true,
  transports: ["websocket", "polling"],
});

interface LikeResponse {
  success: boolean;
  message: string;
  likeStatus: boolean;
}

export interface Post {
  id: string;
  comments: any;
  likedByCurrentUser: any;
  _id: string;
  content: string;
  privacy: string;
  createdAt: string;
  likes_count?: number;
  owner: {
    firstname: string;
    lastname: string;
    profilePhoto?: string;
    title: string;
  };
}

// Custom Base Query using Axios
const customBaseQuery = async ({ url, method, data }: any) => {
  try {
    const result = await axiosInstance({ url, method, data });
    return { data: result.data };
  } catch (error) {
    return { error };
  }
};

// Define the API using RTK Query
export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: customBaseQuery,
  tagTypes: ["Post"],
  endpoints: (builder) => ({
    // Fetch posts with pagination
    fetchPosts: builder.query<{
      posts: Post[];
      hasNextPage: boolean;
    }, { page: number; limit: number }>({
      query: ({ page, limit }) => ({
        url: `/posts?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      transformResponse: (response) => response.posts,
    }),
    fetchPost: builder.query({
      query: (postId) => ({
        url: `/posts/${postId}`,
        method: "GET",
      })
    }),
    getCurrentUser: builder.query({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "GET",
      })
    }),
    getUserPosts: builder.query({
      query: (userId) => ({
        url: `/posts/${userId}/posts`,
        method: "GET",
      }),
      transformResponse: (response) => response.posts || [],
    }),
    uploadProfilePhoto: builder.mutation({
      query: ({ userId, formData }) => ({
        url: `/upload/profile/${userId}`,
        method: 'POST',
        body: formData,
      }),
    }),
    uploadCoverPhoto: builder.mutation({
      query: ({ userId, formData }) => ({
        url: `/upload/cover/${userId}`,
        method: 'POST',
        body: formData,
      }),
    }),
    // Create a new post
    createPost: builder.mutation({
      query: (postData) => ({
        url: "/posts",
        method: "POST",
        data: postData,
      }),
      async onQueryStarted(postData, { dispatch, queryFulfilled }) {
        const tempPost = {
          _id: Date.now().toString(),
          content: postData.get("content"),
          privacy: "public",
          createdAt: new Date().toISOString(),
          owner: {
            firstname: "Yaseen",
            lastname: "Arafat",
            profilePhoto: "https://via.placeholder.com/150",
            title: "Mr.",
          },
        };

        const patchResult = dispatch(
          postsApi.util.updateQueryData("fetchPosts", { page: 1, limit: 5 }, (draft) => {
            draft.posts.unshift({
              ...tempPost, likedByCurrentUser: false,
              comments: undefined,
              id: ""
            });
          })
        );

        try {
          const { data: newPost } = await queryFulfilled;
          dispatch(
            postsApi.util.updateQueryData("fetchPosts", { page: 1, limit: 5 }, (draft) => {
              const index = draft.posts.findIndex((p) => p._id === tempPost._id);
              if (index !== -1) {
                draft.posts[index] = newPost;
              }
            })
          );
        } catch {
          patchResult.undo();
        }
      },
    }),
    // Update a post
    updatePost: builder.mutation<Post, { id: string; postData: FormData }>({
      query: ({ id, postData }) => ({
        url: `/posts/${id}`,
        method: "PUT",
        data: postData,
      }),
      async onQueryStarted({ id, postData }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(postsApi.util.invalidateTags(["Post"]));
        } catch {
          // Optionally handle error
        }
      },
      invalidatesTags: ["Post"],
    }),
    // Delete a post
    deletePost: builder.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          postsApi.util.updateQueryData("fetchPosts", { page: 1, limit: 5 }, (draft) => {
            draft.posts = draft.posts.filter((post) => post._id !== id);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ["Post"],
    }),
    // Toggle Like/Dislike
    // Toggle Like/Dislike mutation inside postsApi
    toggleLike: builder.mutation<LikeResponse, { postId: string }>({
      query: ({ postId }) => ({
        url: `/likes/toggle`,
        method: "POST",
        data: { postId }, // Removed the extra "to" field
      }),
      async onQueryStarted({ postId }, { dispatch, queryFulfilled }) {
        // Optimistically update the UI
        const patchResult = dispatch(
          postsApi.util.updateQueryData("fetchPosts", { page: 1, limit: 5 }, (draft) => {
            const post = draft.posts.find((p) => p._id === postId);
            if (post) {
              const userAlreadyLiked = post.likedByCurrentUser;
              // Toggle the like count based on the current state
              post.likes_count = (post.likes_count ?? 0) + (userAlreadyLiked ? -1 : 1);
              post.likedByCurrentUser = !userAlreadyLiked;
            }
          })
        );

        try {
          const { data } = await queryFulfilled;
          if (!data.success) throw new Error("Failed to like post");

          // Only if the post was just liked, emit a notification
          // (Assuming the backend handles the dislike case separately.)
          if (data.likeStatus === true) {
            socket.emit("likePost", { postId });
          }
        } catch {
          patchResult.undo();
        }
      },
    }),

  }),
});

export const {
  useFetchPostsQuery,
  useFetchPostQuery,
  useGetCurrentUserQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useToggleLikeMutation,
  useGetUserPostsQuery,
  useUploadProfilePhotoMutation, 
  useUploadCoverPhotoMutation
} = postsApi;

// Redux Slice for storing posts (to be used with useSelector)
interface PostState {
  posts: Post[];
  hasNextPage: boolean;
  isFetching: boolean;
}

const initialState: PostState = {
  posts: [],
  hasNextPage: false,
  isFetching: false,
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<{ posts: Post[]; hasNextPage: boolean }>) => {
      state.posts = action.payload.posts;
      state.hasNextPage = action.payload.hasNextPage;
    },
    addPosts: (state, action: PayloadAction<{ posts: Post[]; hasNextPage: boolean }>) => {
      state.posts = [...state.posts, ...action.payload.posts];
      state.hasNextPage = action.payload.hasNextPage;
    },
    setFetching: (state, action: PayloadAction<boolean>) => {
      state.isFetching = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(postsApi.endpoints.fetchPosts.matchFulfilled, (state, action) => {
      const { posts, hasNextPage } = action.payload;
      if (state.posts.length === 0) {
        state.posts = posts;
      } else {
        state.posts = [
          ...state.posts,
          ...posts.filter((newPost) => !state.posts.some((post) => post._id === newPost._id)),
        ];
      }
      state.hasNextPage = hasNextPage;
      state.isFetching = false;
    });
    builder.addMatcher(postsApi.endpoints.fetchPosts.matchPending, (state) => {
      state.isFetching = true;
    });
    builder.addMatcher(postsApi.endpoints.fetchPosts.matchRejected, (state) => {
      state.isFetching = false;
    });
  },
});

export const { setPosts, addPosts, setFetching } = postSlice.actions;
export default postSlice.reducer;
