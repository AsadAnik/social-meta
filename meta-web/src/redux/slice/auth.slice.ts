import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import toaster from "react-hot-toast";
import axiosInstance from "@/lib/axios.interceptor";


const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

// region Axios instance with default configuration
const customBaseQuery = async ({ url, method, data }: any) => {
  try {
    const result = await axiosInstance({ url, method, data });
    return { data: result.data };
  } catch (error) {
    return { error };
  }
};


// region Auth API Slice
export const authAPISlice = createApi({
  reducerPath: "api",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    // region Login Mutation..
    login: builder.mutation({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        data: body,
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          // Destructure response to extract token and user
          const { accessToken, refreshToken, user } = data;
          dispatch(setCredentials({ accessToken, refreshToken, user }));
          console.log('Login successful!', accessToken)

          toaster.success("Login successful!");
        } catch (error) {
          console.error("Login failed: ", error);
          toaster.error("Login failed. Please check your credentials.");
        }
      },
    }),

    // region Register Mutation..
    register: builder.mutation({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        data: body,
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log('data', data);

          if (data) {
            const { accessToken, refreshToken, user } = data;

            dispatch(setCredentials({ accessToken, refreshToken, user }));
          }
        } catch (error) {
          console.error("Registration failed: ", error);
        }
      },
    }),

    // region Logout Mutation
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "GET",
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(clearCredentials());
          toaster.success("Logout successful!");
        } catch (error) {
          console.error("Logout failed: ", error);
          toaster.error("Logout failed. Please try again.");
        }
      },
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation } = authAPISlice;

// region Auth Slice
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

// regioon Auth Initial State
const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // region Set Credentials
    setCredentials: (state, action) => {
      console.log('action', action);

      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
    },
    // region clear Credentials
    clearCredentials: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
