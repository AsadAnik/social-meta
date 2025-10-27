import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosInstance } from '@/lib';
import { postsApi } from './post.slice';
import { IComment } from '@/shared/types';

interface CommentState {
    comments: IComment[];
    loading: boolean;
    error: string | null;
}

const initialState: CommentState = {
    comments: [],
    loading: false,
    error: null,
};

/**
 * Custom Base Query using Axios
 * @param url
 * @param method
 * @param body
 */
const customBaseQuery = async ({ url, method, body }: { url: string; method: string; body: any; }) => {
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

// region COMMENT API SLICE
export const commentsApi = createApi({
    reducerPath: 'commentsApi',
    baseQuery: customBaseQuery,
    tagTypes: ['Comment'],
    endpoints: (builder) => ({
        // region Fetch Comments
        fetchComments: builder.query<{ comments: IComment[], hasNextPage: boolean }, {
            postId: string;
            page: number;
            limit: number;
        }>({
            query: ({ postId, page, limit }) => ({
                url: `/comments/${postId}?page=${page}&limit=${limit}`,
                method: 'GET',
                body: undefined,
            }),
            transformResponse: (response: { data: IComment[], total: number }, meta, arg) => ({
                comments: response.data,
                hasNextPage: arg.page * arg.limit < response.total,
            }),
            providesTags: (result, error, { postId }) => [{ type: 'Comment', id: postId }],
        }),

        // region Add Comments
        addComment: builder.mutation<{ comment: IComment }, { postId: string; comment: string }>({
            query: ({ postId, comment }) => ({
                url: `/comments/`,
                method: 'POST',
                body: { postId, comment },
            }),
            async onQueryStarted({ postId }, { dispatch, queryFulfilled }) {
                const postsListPatch = dispatch(
                    postsApi.util.updateQueryData('fetchPosts', { page: 1, limit: 5 }, (draft) => {
                        const post = draft.posts.find((p) => p._id === postId);
                        if (post) {
                            post.comments_count = (post.comments_count ?? 0) + 1;
                        }
                    })
                );

                try {
                    await queryFulfilled;
                    dispatch(commentsApi.util.invalidateTags([{ type: 'Comment', id: postId }]));
                } catch {
                    postsListPatch.undo();
                }
            },
        }),
    }),
});

export const { useFetchCommentsQuery, useLazyFetchCommentsQuery, useAddCommentMutation } = commentsApi;

const commentSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {},
});

export default commentSlice.reducer;
