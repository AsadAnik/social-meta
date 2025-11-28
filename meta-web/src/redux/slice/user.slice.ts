import { createApi } from "@reduxjs/toolkit/query/react";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from '@/lib/axios.interceptor';
import { IUser } from '@/shared/types';

interface UserState {
    data: IUser | null;
}

// region CUSTOM QUERY
const customBaseQuery = async ({ url, method, data }: any) => {
    try {
        const result = await axiosInstance({ url, method, data });
        return { data: result.data };
    } catch (error) {
        return { error };
    }
};

// region USER-API-SLICE
export const usersApi = createApi({
    reducerPath: 'usersApi',
    baseQuery: customBaseQuery,
    tagTypes: ['User'],
    endpoints: (builder) => ({
        // region Get User Me
        userInfo: builder.query<any, {}>({
            query: () => ({
                url: '/users/me',
                method: 'GET',
            }),
            providesTags: ['User'],
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;

                    // Assuming the actual user object is nested under `data.data`
                    if (data && data.user) {
                        dispatch(setUserInfo(data.user));
                    }

                } catch (error) {
                    console.error('Failed to fetch and set user info:', error);
                }
            },
        }),
    }),
});

// region INITIAL STATE
const initialState: UserState = {
    data: null,
};

// region USER-SLICE
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserInfo: (state, action: PayloadAction<IUser>) => {
            state.data = action.payload;
        },
        clearUserInfo: (state) => {
            state.data = null;
        },
    },
});

export const { setUserInfo, clearUserInfo } = userSlice.actions;
export default userSlice.reducer;
export const { useUserInfoQuery } = usersApi;
