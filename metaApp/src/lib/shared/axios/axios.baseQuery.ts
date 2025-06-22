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

            const result = await axiosInstance({
                url,
                method,
                data,
                params,
                headers: {
                    ...(headers ?? {}),
                    ...(isFormData
                        ? {
                            // Let Axios auto-set Content-Type with boundary
                            'Content-Type': undefined,
                        }
                        : { 'Content-Type': 'application/json' }),
                },
                transformRequest: isFormData
                    ? [(formData, reqHeaders) => {
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
