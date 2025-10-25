import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import { AxiosRequestConfig } from 'axios';
import axiosInstance from './axios.Interceptor';

/**
 * Axios-based custom base query for RTK Query
 * Compatible with FormData (Android-friendly)
 */
const axiosBaseQuery = (): BaseQueryFn<
    {
        url: string;
        method: AxiosRequestConfig['method'];
        data?: AxiosRequestConfig['data'];
        params?: AxiosRequestConfig['params'];
        headers?: AxiosRequestConfig['headers'];
    },
    unknown,
    unknown
> =>
    async ({ url, method, data, params, headers }) => {
        try {
            const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;

            // Debug FormData for iOS
            if (isFormData) {
                console.log('[AXIOS-BASE-QUERY] FormData detected');
                console.log('[AXIOS-BASE-QUERY] FormData object:', data);
            }

            const result = await axiosInstance({
                url,
                method,
                data,
                params,
                headers: {
                    ...(headers ?? {}),
                    ...(isFormData
                        ? {
                            // For iOS, let the browser set the Content-Type with boundary
                            'Content-Type': undefined,
                        }
                        : { 'Content-Type': 'application/json' }),
                },
                transformRequest: isFormData
                    ? [(formData, reqHeaders) => {
                        // Remove Content-Type to let browser set it with boundary
                        delete reqHeaders['Content-Type'];
                        delete reqHeaders['content-type'];
                        console.log('[AXIOS-BASE-QUERY] FormData transformRequest - removed Content-Type');
                        return formData;
                    }]
                    : undefined,
            });

            return { data: result.data };

        } catch (axiosError: any) {
            console.error('[AXIOS-BASE-QUERY] Error:', axiosError);
            console.error('[AXIOS-BASE-QUERY] Response:', axiosError.response?.data);
            return {
                error: {
                    status: axiosError.response?.status || 500,
                    data: axiosError.response?.data || axiosError.message,
                },
            };
        }
    };

export default axiosBaseQuery;
