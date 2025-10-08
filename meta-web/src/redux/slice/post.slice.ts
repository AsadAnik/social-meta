import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios.interceptor";
import { io } from "socket.io-client";
import { IPost } from '@/shared/types';

// region Socket Initialization
const socket = io("http://localhost:8080"!, {
  withCredentials: true,
  transports: ["websocket", "polling"],
});

// region Types
interface LikeResponse {
  success: boolean;
  message: string;
  likeStatus: boolean;
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

// region Posts API Slice
export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: customBaseQuery,
  tagTypes: ["Post"],
  endpoints: (builder) => ({
    // region Fetch Posts
    fetchPosts: builder.query<{
      posts: IPost[];
      hasNextPage: boolean;
    }, { page: number; limit: number }>({
      query: ({ page, limit }) => ({
        url: `/posts?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Post"],
    }),

    // region Fetch Post
    fetchPost: builder.query<IPost, string>({
      query: (postId) => ({
        url: `/posts/${postId}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Post", id }],
    }),

    // region Current User
    getCurrentUser: builder.query({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "GET",
      }),
    }),

    // region User Post
    getUserPosts: builder.query<IPost[], string>({
      query: (userId) => ({
        url: `/posts/${userId}/posts`,
        method: "GET",
      }),
      transformResponse: (response: any) => response.posts || [],
      providesTags: ["Post"],
    }),

    // region Upload Profile Pic
    uploadProfilePhoto: builder.mutation({
      query: ({ userId, formData }: { userId: string; formData: FormData }) => ({
        url: `/users/update-photo`,
        method: 'PATCH',
        data: formData,
      }),
    }),

    // region Upload Cover Pic
    uploadCoverPhoto: builder.mutation({
      query: ({ userId, formData }: { userId: string; formData: FormData }) => ({
        url: `/users/update-cover`,
        method: 'PATCH',
        data: formData,
      }),
    }),

    // region Create Post
    createPost: builder.mutation<IPost, FormData>({
      query: (postData) => ({
        url: "/posts",
        method: "POST",
        data: postData,
      }),
      async onQueryStarted(postData, { dispatch, queryFulfilled }) {
        // Optimistic update: Add a temporary post to the cache
        const tempPost: Partial<IPost> = {
          _id: Date.now().toString(),
          content: postData.get("content") as string || "",
          body: "",
          createdAt: new Date().toISOString(),
          likes_count: 0,
          dislikes_count: 0,
          comments_count: 0,
          image: "",
          owner: {
            _id: "temp",
            firstname: "Current", // TODO: Replace with actual current user data
            lastname: "User",
            profilePhoto: "https://via.placeholder.com/150",
            title: "User",
          },
        };

        const patchResult = dispatch(
          postsApi.util.updateQueryData("fetchPosts", { page: 1, limit: 5 }, (draft) => {
            draft.posts.unshift(tempPost as IPost);
          })
        );

        try {
          const { data: newPost } = await queryFulfilled;
          // Replace temp post with actual post
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
      invalidatesTags: ["Post"],
    }),

    // region Update Post
    updatePost: builder.mutation<IPost, { postId: string; postData: FormData }>({
      query: ({ postId, postData }) => ({
        url: `/posts/${postId}`,
        method: "PUT",
        data: postData,
      }),
      invalidatesTags: (result, error, { postId }) => [{ type: "Post", id: postId }],
    }),

    // region Delete Post
    deletePost: builder.mutation<{ _id: string }, string>({
      query: (postId) => ({
        url: `/posts/${postId}`,
        method: "DELETE",
      }),
      async onQueryStarted(postId, { dispatch, queryFulfilled }) {
        // Optimistic delete
        const patchResult = dispatch(
          postsApi.util.updateQueryData("fetchPosts", { page: 1, limit: 5 }, (draft) => {
            draft.posts = draft.posts.filter((post) => post._id !== postId);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, postId) => [{ type: "Post", id: postId }],
    }),

    // region Toggle Like
    toggleLike: builder.mutation<LikeResponse, { postId: string }>({
      query: ({ postId }) => ({
        url: `/likes/toggle`,
        method: "POST",
        data: { postId },
      }),
      async onQueryStarted({ postId }, { dispatch, queryFulfilled }) {
        // Optimistic update for like toggle
        const patchResult = dispatch(
          postsApi.util.updateQueryData("fetchPosts", { page: 1, limit: 5 }, (draft) => {
            const post = draft.posts.find((p) => p._id === postId);
            if (post) {
              const wasLiked = post.likedByCurrentUser || false;
              post.likes_count = (post.likes_count || 0) + (wasLiked ? -1 : 1);
              post.likedByCurrentUser = !wasLiked;
            }
          })
        );

        try {
          const { data } = await queryFulfilled;
          if (!data.success) throw new Error("Failed to toggle like");

          // Emit notification if liked
          if (data.likeStatus) {
            socket.emit("notification", { postId, type: "like" });
          }
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

// region Hooks Export
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
  useUploadCoverPhotoMutation,
} = postsApi;

// region Post State Slice
interface PostState {
  posts: IPost[];
  hasNextPage: boolean;
  isFetching: boolean;
}

const initialState: PostState = {
  posts: [],
  hasNextPage: false,
  isFetching: false,
};

// region POST SLICE
const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<{ posts: IPost[]; hasNextPage: boolean }>) => {
      state.posts = action.payload.posts;
      state.hasNextPage = action.payload.hasNextPage;
    },
    addPosts: (state, action: PayloadAction<{ posts: IPost[]; hasNextPage: boolean }>) => {
      state.posts = [...state.posts, ...action.payload.posts];
      state.hasNextPage = action.payload.hasNextPage;
    },
    setFetching: (state, action: PayloadAction<boolean>) => {
      state.isFetching = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(postsApi.endpoints.fetchPosts.matchFulfilled, (state, action) => {
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
      })
      .addMatcher(postsApi.endpoints.fetchPosts.matchPending, (state) => {
        state.isFetching = true;
      })
      .addMatcher(postsApi.endpoints.fetchPosts.matchRejected, (state) => {
        state.isFetching = false;
      });
  },
});

export const { setPosts, addPosts, setFetching } = postSlice.actions;
export default postSlice.reducer;
