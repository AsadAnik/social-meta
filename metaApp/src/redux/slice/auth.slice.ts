import { createApi } from "@reduxjs/toolkit/query/react";
import { createSlice } from "@reduxjs/toolkit";
import Toast from "react-native-toast-message";
import axiosInstance from "../../lib/axiosInstance";

// Base API URL
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

// Custom base query with Axios
const customBaseQuery = async ({ url, method, data }: any) => {
  try {
    const result = await axiosInstance({ url, method, data });
    return { data: result.data };
  } catch (error) {
    return { error };
  }
};

// Auth API Slice
export const authAPISlice = createApi({
  reducerPath: "api",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: ({ page = 1, limit = 5 }) => ({
        url: `/post/read_all_posts?page=${page}&limit=${limit}`,
        method: "GET",
      }),
    }),

    addPost: builder.mutation({
      query: (body) => ({
        url: "posts",
        method: "POST",
        body,
      }),
    }),

    login: builder.mutation({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        data: body,
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { accessToken, refreshToken, user } = data;
          dispatch(setCredentials({ accessToken, refreshToken, user }));

          Toast.show({
            type: "success",
            text1: "Login Successful!",
          });
        } catch (error) {
          console.error("Login failed: ", error);
          Toast.show({
            type: "error",
            text1: "Login failed",
            text2: "Please check your credentials.",
          });
        }
      },
    }),

    register: builder.mutation({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        data: body,
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { accessToken, refreshToken, user } = data;

          dispatch(setCredentials({ accessToken, refreshToken, user }));
          Toast.show({
            type: "success",
            text1: "Registration Successful!",
          });
        } catch (error) {
          console.error("Registration failed: ", error);
          Toast.show({
            type: "error",
            text1: "Registration failed",
          });
        }
      },
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "GET",
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(clearCredentials());
          Toast.show({
            type: "success",
            text1: "Logout Successful!",
          });
        } catch (error) {
          console.error("Logout failed: ", error);
          Toast.show({
            type: "error",
            text1: "Logout failed",
          });
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetPostsQuery,
  useLogoutMutation,
} = authAPISlice;

// Auth State Interface
interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: {
    id: string;
    firstname?: string;
    lastname?: string;
    email: string;
  } | null;
}

// Auth Initial State
const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
    },
    clearCredentials: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
