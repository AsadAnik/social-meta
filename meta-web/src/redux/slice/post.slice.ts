// redux/slice/post.slice.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios.interceptor";
import { JSX } from "react";

// Custom Base Query using Axios
const customBaseQuery = async ({ url, method, data }: any) => {
  try {
    const result = await axiosInstance({ url, method, data });
    return { data: result.data };
  } catch (error) {
    return { error };
  }
};

// Post Interface
export interface Post {
  _id: string;
  content: string;
  privacy: string;
  createdAt: string;
  owner: {
    firstname: string;
    lastname: string;
    profilePhoto?: string;
    title: string;
  };
}

// Define the API using RTK Query
export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: customBaseQuery,
  tagTypes: ["Post"],
  endpoints: (builder) => ({
    // Fetch posts with pagination
    fetchPosts: builder.query<{
      map(arg0: (post: Post) => JSX.Element): import("react").ReactNode; posts: Post[]; hasNextPage: boolean
    }, { page: number; limit: number }>({
      query: ({ page, limit }) => ({
        url: `/posts?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.posts;
      },
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
            draft.posts.unshift(tempPost);
          })
        );

        try {
          // 3️⃣ Wait for API Response (Real Post)
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
    updatePost: builder.mutation<Post, { id: string; postData: FormData }>({
      query: ({ id, postData }) => ({
        url: `/posts/${id}`,
        method: "PUT",
        data: postData,
      }),
      async onQueryStarted({ id, postData }, { dispatch, queryFulfilled }) {
        // Optionally, create an optimistic update here.
        // For simplicity, we'll wait for API response and then invalidate cache.
        try {
          await queryFulfilled;
          dispatch(postsApi.util.invalidateTags(["Post"]));
        } catch {
          // Handle error if needed
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
        // Optimistically remove the post from the cache.
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
  }),
});

export const { useFetchPostsQuery, useCreatePostMutation, useUpdatePostMutation, useDeletePostMutation } = postsApi;

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
    // Set posts data (replacing existing data)
    setPosts: (state, action: PayloadAction<{ posts: Post[]; hasNextPage: boolean }>) => {
      state.posts = action.payload.posts;
      state.hasNextPage = action.payload.hasNextPage;
    },
    // Append additional posts (for infinite scroll)
    addPosts: (state, action: PayloadAction<{ posts: Post[]; hasNextPage: boolean }>) => {
      state.posts = [...state.posts, ...action.payload.posts];
      state.hasNextPage = action.payload.hasNextPage;
    },
    setFetching: (state, action: PayloadAction<boolean>) => {
      state.isFetching = action.payload;
    },
  },
  extraReducers: (builder) => {
    // When RTK Query's fetchPosts succeeds, update our local Redux state.
    builder.addMatcher(postsApi.endpoints.fetchPosts.matchFulfilled, (state, action) => {
      const { posts, hasNextPage } = action.payload;
      // For page 1, we replace; for subsequent pages, we append:
      if (state.posts.length === 0) {
        state.posts = posts;
      } else {
        state.posts = [...state.posts, ...posts.filter(
          (newPost) => !state.posts.some((post) => post._id === newPost._id)
        )];
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
