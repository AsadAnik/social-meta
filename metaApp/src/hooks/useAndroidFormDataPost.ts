import { useState } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/environment';
import Toast from 'react-native-toast-message';

type UseAndroidFormDataPostParams = {
    formData: FormData;
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
};

/**
 * This hook is only used for sending FormData on Android.
 * It uses Fetch API for Android (to fix FormData issues),
 * and for iOS or Web, we use RTK Query/Mutation with Axios instead.
 */
const useAndroidFormDataPost = () => {
    const [loading, setLoading] = useState(false);

    const postFormData = async ({
        formData,
        onSuccess,
        onError,
    }: UseAndroidFormDataPostParams) => {
        if (Platform.OS !== 'android') {
            throw new Error('useAndroidFormDataPost is only intended for Android.');
        }

        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('accessToken');

            const response = await fetch(`${API_URL}/posts`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    Authorization: token ? `Bearer ${token}` : '',
                },
                body: formData,
            });

            const contentType = response.headers.get('content-type');
            let result;

            if (contentType?.includes('application/json')) {
                result = await response.json();
            } else {
                const text = await response.text();
                throw new Error(text || 'Server returned a non-JSON response');
            }

            if (!response.ok) {
                throw new Error(result?.message || 'Something went wrong');
            }

            Toast.show({
                type: 'success',
                text1: 'Post Created',
                text2: 'Your post was successfully published!',
            });

            onSuccess?.(result);

        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.message || 'Failed to create post',
            });

            onError?.(error);
        } finally {
            setLoading(false);
        }
    };

    return { postFormData, loading };
};

export default useAndroidFormDataPost;
