import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react';
import { createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/shared/axios/axiosInstance';
import Toast from 'react-native-toast-message';

// Custom base query for Axios
// region Custom Base Query
const axiosBaseQuery = (): BaseQueryFn<
    { url: string; method: string; data?: any; params?: any },
    unknown,
    unknown
> => async ({ url, method, data, params }) => {
    try {
        const result = await axiosInstance({ url, method, data, params });
        return { data: result.data };

    } catch (axiosError) {
        let err = axiosError as any;
        return {
            error: {
                status: err.response?.status,
                data: err.response?.data || err.message,
            },
        };
    }
};

// region API CALLS
export const postAPI = createApi({
    reducerPath: 'postAPI',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Posts'],
    endpoints: (builder) => ({
        // region Gets All Posts
        getAllPosts: builder.query({
            query: ({ page = 1, limit = 5 }) => ({
                url: `/posts`,
                method: 'GET',
                params: { page, limit },
            }),
            providesTags: ['Posts'],
        }),

        // region Create Post
        createPost: builder.mutation<any, any>({
            query: (formData: FormData) => {
                return {
                  url: "/posts",
                  method: "POST",
                  data: formData,
                  headers: {
                    'Content-Type': 'multipart/form-data',
                  },
                };
            },
            invalidatesTags: ['Posts'],
            async onQueryStarted(_, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                    Toast.show({
                        type: 'success',
                        text1: 'Post Created',
                        text2: 'Your post was successfully published!',
                    });
                } catch (err: any) {
                    const message =
                        err?.error?.data?.message ||
                        err?.error?.message ||
                        'Failed to create post';

                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: message,
                    });
                }
            },
        }),

        // region Update Post
        updatePost: builder.mutation({
            query: ({ id, content }) => ({
                url: `/posts/${id}`,
                method: 'PUT',
                data: { content },
            }),
            invalidatesTags: ['Posts'],
            async onQueryStarted(_, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                    Toast.show({
                        type: 'success',
                        text1: 'Post Updated',
                        text2: 'Your post was successfully updated!',
                    });
                } catch (err: any) {
                    const message = err?.error?.data?.message || 'Failed to update post';
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: message,
                    });
                }
            },
        }),

        // region Delete Post
        deletePost: builder.mutation({
            query: (postId) => ({
                url: `/posts/${postId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Posts'],
            async onQueryStarted(_, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                    Toast.show({
                        type: 'success',
                        text1: 'Post Deleted',
                        text2: 'Your post was successfully deleted!',
                    });
                } catch (err: any) {
                    const message = err?.error?.data?.message || 'Failed to delete post';
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: message,
                    });
                }
            },
        }),

        // region Like Post
        likePost: builder.mutation({
            query: ({ postId }) => ({
                url: '/likes/toggle',
                method: 'POST',
                data: { postId },
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                } catch (err) {
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: 'Failed to toggle like',
                    });
                }
            },
        }),

    }),
});

export const {
    useGetAllPostsQuery,
    useCreatePostMutation,
    useUpdatePostMutation,
    useDeletePostMutation,
    useLikePostMutation,
} = postAPI;


// region POST SLICES
const postSlice = createSlice({
    name: 'post',
    initialState: {
        selectedPost: null,
    },
    reducers: {
        setSelectedPost: (state, action) => {
            state.selectedPost = action.payload;
        },
        clearSelectedPost: (state) => {
            state.selectedPost = null;
        },
    },
});

export const { setSelectedPost, clearSelectedPost } = postSlice.actions;
export default postSlice.reducer;
