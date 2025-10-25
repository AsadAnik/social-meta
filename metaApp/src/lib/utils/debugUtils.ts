import { Platform } from 'react-native';

/**
 * Debug the network request
 * @param config - The network request config
 */
// region Debug Network Request
export const debugNetworkRequest = (config: any) => {
  console.log('=== NETWORK DEBUG INFO ===');
  console.log('Platform:', Platform.OS);
  console.log('API URL:', config.baseURL);
  console.log('Request URL:', config.url);
  console.log('Method:', config.method);
  console.log('Headers:', config.headers);
  console.log('Data Type:', typeof config.data);
  console.log('Is FormData:', config.data instanceof FormData);

  if (config.data instanceof FormData) {
    console.log('FormData entries:');
    for (let [key, value] of config.data.entries()) {
      console.log(`  ${key}:`, value);
    }
  }

  console.log('========================');
};

/**
 * Debug the network response
 * @param response - The network response
 */
// region Debug Network Response
export const debugNetworkResponse = (response: any) => {
  console.log('=== RESPONSE DEBUG INFO ===');
  console.log('Status:', response.status);
  console.log('Status Text:', response.statusText);
  console.log('Headers:', response.headers);
  console.log('Data:', response.data);
  console.log('==========================');
};

/**
 * Debug the network error
 * @param error - The network error
 */
// region Debug Network Error
export const debugNetworkError = (error: any) => {
  console.log('=== ERROR DEBUG INFO ===');
  console.log('Error Message:', error.message);
  console.log('Error Code:', error.code);
  console.log('Error Config:', error.config);

  if (error.response) {
    console.log('Response Status:', error.response.status);
    console.log('Response Data:', error.response.data);
    console.log('Response Headers:', error.response.headers);
  }

  console.log('=======================');
};
