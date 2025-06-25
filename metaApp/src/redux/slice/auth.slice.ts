import { createApi } from '@reduxjs/toolkit/query/react';
import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { axiosBaseQuery } from '../../lib/shared';

// Auth API
// region Auth API
export const authAPI = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    // region Login Mutation
    login: builder.mutation({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        data: body,
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { accessToken, refreshToken, user } = data;
          dispatch(setCredentials({ accessToken, refreshToken, user }));
        } catch (err: any) {
          const errorMessage = err?.error?.data?.message || 'Login failed';
          Toast.show({
            type: 'error',
            text1: 'Login Failed',
            text2: errorMessage,
          });
          console.log('🧨 Error Message:', errorMessage);
        }
      },
    }),

    // region Register Mutation
    register: builder.mutation({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        data: body,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { accessToken, refreshToken, user } = data;
          dispatch(setCredentials({ accessToken, refreshToken, user }));

        } catch (err: any) {
          console.error('Register error:', err?.response?.data || err);
          Toast.show({
            type: 'error',
            text1: 'Registration Failed',
            text2: err?.response?.data?.message || err?.message || 'Something went wrong',
          });
        }
      },
    }),

    // region Logout Mutation
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'GET',
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(clearCredentials());

        } catch (error) {
          console.error('Logout failed: ', error);
        }
      },
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation } = authAPI;


// Auth State Interface
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

// Auth Initial State
const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
};

// Auth-Slice..
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // region SetCredentials
    setCredentials: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;

      // Setting to the AsyncStorage for Mobile Local-Storage
      AsyncStorage.setItem('accessToken', action.payload.accessToken);
      AsyncStorage.setItem('refreshToken', action.payload.refreshToken);
      AsyncStorage.setItem('user', JSON.stringify(action.payload.user));
    },

    // region ClearCrendential
    clearCredentials: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;

      AsyncStorage.removeItem('accessToken');
      AsyncStorage.removeItem('refreshToken');
      AsyncStorage.removeItem('user');
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
