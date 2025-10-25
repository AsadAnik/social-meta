import axios, { InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from '../../../redux/store';
import { setCredentials, clearCredentials } from '../../../redux/slice/auth.slice';
import Toast from 'react-native-toast-message';
import { Platform } from 'react-native';
import { debugNetworkRequest, debugNetworkResponse, debugNetworkError } from '../../utils/debugUtils';
import { API_URL } from '../../../config/environment';
import { checkNetworkConnectivity, showNetworkError } from '../../utils/networkUtils';

declare global {
  var navigationRef: {
    current: {
      navigate: (screen: string) => void;
    };
  };
}

let isRefreshing: boolean = false;

/**
 * Wait for refresh
 * @returns The access token
 */
const waitForRefresh = () =>
  new Promise<string | null>((resolve) => {
    const interval = setInterval(() => {
      if (!isRefreshing) {
        clearInterval(interval);
        resolve(AsyncStorage.getItem('accessToken'));
      }
    }, 200);
});

/**
 * Create Axios instance
 * @returns The Axios instance
 */
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 30000, // 30 seconds timeout
});


// Attach Access Token to Request Headers
// region Request Interceptor
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const isFormData = config.data instanceof FormData;
    const contentType = config.headers?.['Content-Type'] || config.headers?.['content-type'];

    // Debug logging for Android FormData issues
    if (Platform.OS === 'android' && isFormData) {
      debugNetworkRequest(config);
    }

    console.log('[REQUEST] - ', config.method?.toUpperCase(), config.url, isFormData ? '[FormData]' : config.data);
    console.log('[REQUEST-CONTENT-TYPE] - ', contentType);

    try {
      // Check network connectivity before making request
      const isConnected = await checkNetworkConnectivity();
      if (!isConnected) {
        showNetworkError();
        return Promise.reject(new Error('No internet connection'));
      }

      // Fix the linter error by properly typing the store state
      const state = store.getState() as any;
      const token = state.auth?.accessToken;
      const accessToken = token ?? await AsyncStorage.getItem('accessToken');

      if (accessToken) {
        if (config.headers) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      }

      // Handle FormData specifically for Android
      if (isFormData && Platform.OS === 'android') {
        // Remove Content-Type header to let the browser set it with boundary
        if (config.headers) {
          delete config.headers['Content-Type'];
          delete config.headers['content-type'];
        }
      }
    } catch (error) {
      console.error('Error attaching token to request:', error);
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// Handle Refresh Token Mechanism
// region Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Debug logging for Android FormData issues
    if (Platform.OS === 'android') {
      debugNetworkResponse(response);
    }

    console.log('[RESPONSE] - ', response.config.url, response.status, response.data);
    console.log('[RESPONSE STATUS] - ', response.status);
    console.log('[RESPONSE DATA] - ', response.data);
    console.log('[RESPONSE HEADERS] - ', response.headers);

    return response;
  },
  async (error) => {
    // Debug logging for Android FormData issues
    if (Platform.OS === 'android') {
      debugNetworkError(error);
    }

    const originalRequest = error.config;

    // Handle network connectivity errors
    if (error.message === 'Network Error' || error.code === 'NETWORK_ERROR' || !error.response) {
      const isConnected = await checkNetworkConnectivity();
      if (!isConnected) {
        showNetworkError();
        return Promise.reject(new Error('No internet connection. Please check your network settings.'));
      }
    }

    // Handle timeout errors
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      Toast.show({
        type: 'error',
        text1: 'Request Timeout',
        text2: 'The request took too long. Please try again.',
        position: 'top',
        visibilityTime: 4000,
      });
      return Promise.reject(error);
    }

    // Handle server errors (5xx)
    if (error.response?.status >= 500) {
      Toast.show({
        type: 'error',
        text1: 'Server Error',
        text2: 'Something went wrong on our end. Please try again later.',
        position: 'top',
        visibilityTime: 4000,
      });
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log('🔁 Attempting token refresh...');

      // If already refreshing, wait for it to complete
      if (isRefreshing) {
        const newAccessToken = await waitForRefresh();

        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);

        } else {
          //  Refresh failed while waiting — treat as expired
          Toast.show({
            type: 'error',
            text1: 'Session expired',
            text2: 'Please login again.',
          });

          await AsyncStorage.clear();
          store.dispatch(clearCredentials());

          if ((global as any).navigationRef?.current) {
            global.navigationRef.current.navigate('Login');
          }

          return Promise.reject(error);
        }
      }

      // Otherwise start refresh
      isRefreshing = true;

      try {
        const storedRefreshToken = await AsyncStorage.getItem('refreshToken');

        if (!storedRefreshToken) {
          throw new Error('No refresh token found');
        }

        const refreshResponse = await axiosInstance.post(`${API_URL}/auth/refresh_token`,
          { refreshToken: storedRefreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshResponse.data.data;
        console.log('access', newAccessToken);
        console.log('refresh', newRefreshToken);

        // Store new tokens
        await AsyncStorage.setItem('accessToken', newAccessToken);
        await AsyncStorage.setItem('refreshToken', newRefreshToken);
        store.dispatch(setCredentials({ accessToken: newAccessToken, refreshToken: newRefreshToken }));

        Toast.show({
          type: 'success',
          text1: 'Token Refreshed',
          text2: 'A new access token was issued.',
        });

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);

      } catch (refreshError) {
        await AsyncStorage.clear();
        store.dispatch(clearCredentials());

        if ((global as any).navigationRef?.current) {
          Toast.show({
            type: 'error',
            text1: 'Session expired',
            text2: 'Please login again.',
          });
          global.navigationRef.current.navigate('Login');
        }

        return Promise.reject(refreshError);

      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;
