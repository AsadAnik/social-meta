import { Platform } from 'react-native';
import axiosInstance from '../lib/shared/axios/axios.Interceptor';
import Toast from 'react-native-toast-message';

/**
 * Test FormData on Android
 * @returns void
 */
// region Test FormData
export const testFormDataOnAndroid = async () => {
    console.log('🧪 Testing FormData on Android...');
    console.log('📱 Platform:', Platform.OS);

    if (Platform.OS !== 'android') {
        console.log('⚠️ This test is for Android only');
        return;
    }

    try {
        // Test 1: Simple FormData without file
        console.log('🔍 Test 1: Simple FormData (text only)');
        const simpleFormData = new FormData();
        simpleFormData.append('content', 'Test post content');
        simpleFormData.append('test', 'test value');

        console.log('📦 FormData created:', simpleFormData);
        console.log('📋 FormData _parts:', (simpleFormData as any)._parts);

        const response1 = await axiosInstance.post('/test-formdata', simpleFormData);
        console.log('✅ Simple FormData test:', response1.status);

    } catch (error: any) {
        console.log('❌ Simple FormData test failed:', error.message);
        console.log('🔍 Error details:', {
            status: error.response?.status,
            data: error.response?.data,
            headers: error.response?.headers,
        });
    }

    try {
        // Test 2: FormData with mock file
        console.log('🔍 Test 2: FormData with mock file');
        const formDataWithFile = new FormData();
        formDataWithFile.append('content', 'Test post with file');

        // Create a mock file object
        const mockFile = {
            uri: 'file:///mock/path/image.jpg',
            type: 'image/jpeg',
            name: 'test-image.jpg',
        };

        formDataWithFile.append('media', mockFile as any);

        console.log('📦 FormData with file created');
        console.log('📋 FormData _parts:', (formDataWithFile as any)._parts);

        const response2 = await axiosInstance.post('/test-formdata', formDataWithFile);
        console.log('✅ FormData with file test:', response2.status);

    } catch (error: any) {
        console.log('❌ FormData with file test failed:', error.message);
        console.log('🔍 Error details:', {
            status: error.response?.status,
            data: error.response?.data,
            headers: error.response?.headers,
        });
    }

    Toast.show({
        type: 'info',
        text1: 'FormData Test Complete',
        text2: 'Check console for results',
    });
};


/**
 * Create FormData for Android
 * @param content - The content of the post
 * @param media - The media of the post
 * @returns FormData
 */
// region Create FormData
export const createFormDataForAndroid = (content: string, media?: any) => {
    const formData = new FormData();

    // Add content
    formData.append('content', content);

    // Add media if provided
    if (media) {
        const mediaFile = {
            uri: media.uri,
            type: media.type || 'image/jpeg',
            name: media.fileName || `media-${Date.now()}.${(media.type || 'image/jpeg').split('/')[1]}`,
        };

        formData.append('media', mediaFile as any);
    }

    console.log('📦 FormData created for Android');
    console.log('📋 Content:', content);
    console.log('📋 Media:', media);
    console.log('📋 FormData _parts:', (formData as any)._parts);

    return formData;
};
