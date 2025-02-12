import axios, { InternalAxiosRequestConfig } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { store } from "../redux/store";
import { setCredentials, clearCredentials } from "../redux/slice/auth.slice";
import Toast from "react-native-toast-message";

declare global {
  var navigationRef: {
    current: {
      navigate: (screen: string) => void;
    };
  };
}

const API_URL = "http://localhost:8080/api/v1"; // Replace with your server URL

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Attach Access Token to Request Headers
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    } catch (error) {
      console.error("Error attaching token to request:", error);
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// Handle Refresh Token Mechanism
axiosInstance.interceptors.response.use(
  (response: any) => response,
  async (error: { config: any; response: { status: number; }; }) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem("refreshToken");

        if (!refreshToken) {
          throw new Error("No refresh token found.");
        }

        // Attempt to refresh the token
        const refreshResponse = await axios.post(
          `${API_URL}/auth/refresh_token`,
          { refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          refreshResponse.data.data;

        // Store the updated tokens in AsyncStorage
        await AsyncStorage.setItem("accessToken", newAccessToken);
        await AsyncStorage.setItem("refreshToken", newRefreshToken);

        // Update Redux state (optional if still using it)
        store.dispatch(setCredentials({ accessToken: newAccessToken, refreshToken: newRefreshToken }));

        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        store.dispatch(clearCredentials());
        await AsyncStorage.clear();

        // Show a Toast notification
        Toast.show({
          type: "error",
          text1: "Session expired",
          text2: "Please login again.",
        });

        // Navigate to login screen (assuming you use React Navigation)
        if ((global as any).navigationRef?.current) {
          global.navigationRef.current.navigate("Login");
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
