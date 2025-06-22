import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import axios, { AxiosRequestConfig } from 'axios';
import { store } from '../../../redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../../config/environment';

/**
 * Base Interceptor to creating for Post
 * This will make axios adaptor for post issue which is the formData issue for Android.
 * Android formData as not abled to send network requset for some reason.
 * @returns
 */
const axiosBaseQuery =
    (): BaseQueryFn<
        {
            url: string;
            method: AxiosRequestConfig['method'];
            data?: AxiosRequestConfig['data'];
            params?: AxiosRequestConfig['params'];
            headers?: AxiosRequestConfig['headers'];
            skipAuth?: boolean;
        },
        unknown,
        unknown
    > =>
        async ({ url, method, data, params, headers }) => {
            try {
                const token = store.getState().auth.accessToken ?? (await AsyncStorage.getItem('accessToken'));
                const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;

                const result = await axios({
                    baseURL: API_URL,
                    url,
                    method,
                    data,
                    params,
                    headers: {
                        ...(headers ?? {}),
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                        ...(isFormData
                            ? {
                                // Let Axios auto-set multipart boundary
                                'Content-Type': undefined,
                            }
                            : { 'Content-Type': 'application/json' }),
                    },
                    transformRequest: isFormData
                        ? [(formData, reqHeaders) => {
                            // Delete Content-Type so Axios sets it correctly
                            delete reqHeaders['Content-Type'];
                            return formData;
                        }]
                        : undefined,
                });

                return { data: result.data };

            } catch (axiosError: any) {
                return {
                    error: {
                        status: axiosError.response?.status || 500,
                        data: axiosError.response?.data || axiosError.message,
                    },
                };
            }
        };

export default axiosBaseQuery;
