import axios from "axios";
import { store, RootState } from "@/redux/store";
import { clearCredentials, setCredentials } from "@/redux/slice/auth.slice";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

// region Axios Instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});


// region Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState() as RootState;
    const accessToken = state.auth.accessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (Refresh Token Machanism)
// region Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is due to an expired token
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const state = store.getState() as RootState;
        // Attempt to refresh the access token
        const refreshResponse = await axios.post(
      `${API_URL}/auth/refresh_token`,
      { refreshToken: state.auth.refreshToken },
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("Refresh Response: ", refreshResponse.data);

        const { accessToken, refreshToken } = refreshResponse.data.data;
        // Update tokens in Redux Persistance State..
        store.dispatch(setCredentials({ accessToken, refreshToken }));

        // Retry the original request with the new access token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        store.dispatch(clearCredentials());

        // If refresh fails, clear credentials and redirect and redirect to login
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    // Handle Other Errors
    return Promise.reject(error);
  }
);

export default axiosInstance;
