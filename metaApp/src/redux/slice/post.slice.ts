import { createApi } from '@reduxjs/toolkit/query/react';
import { createSlice } from '@reduxjs/toolkit';
import axiosBaseQuery from '../../lib/shared/axios/axios.baseQuery';
import Toast from 'react-native-toast-message';

// region Post API
export const postAPI = createApi({
    reducerPath: 'postAPI',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Posts'],
    endpoints: (builder) => ({
        // region Get All Posts
        getAllPosts: builder.query<any, { page?: number; limit?: number }>({
            query: ({ page = 1, limit = 5 }) => ({
                url: '/posts',
                method: 'GET',
                params: { page, limit },
            }),
            providesTags: ['Posts'],
        }),

        // region Create Post
        createPost: builder.mutation<any, FormData>({
            query: (formData) => ({
                url: '/posts',
                method: 'POST',
                data: formData,
                headers: {
                    Accept: 'application/json',
                },
            }),
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
                    const message = err?.error?.data?.message || err?.error?.message || 'Failed to create post';
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: message,
                    });
                }
            },
        }),

        // region Update Post
        updatePost: builder.mutation<any, { id: string; content: string }>({
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
        deletePost: builder.mutation<any, string>({
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

        // region Like/Unlike Post
        likePost: builder.mutation<any, { postId: string }>({
            query: ({ postId }) => ({
                url: '/likes/toggle',
                method: 'POST',
                data: { postId },
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                try {
                    await queryFulfilled;

                } catch (error) {
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

export const { useGetAllPostsQuery, useCreatePostMutation, useUpdatePostMutation, useDeletePostMutation, useLikePostMutation } = postAPI;

// region Post Slice
const postSlice = createSlice({
    name: 'post',
    initialState: {
        selectedPost: null as any,
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
