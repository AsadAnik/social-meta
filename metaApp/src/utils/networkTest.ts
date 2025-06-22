import { Platform } from 'react-native';
import axiosInstance from '../lib/shared/axios/axios.Interceptor';
import Toast from 'react-native-toast-message';

export interface NetworkTestResult {
  success: boolean;
  error?: string;
  details: {
    platform: string;
    url: string;
    method: string;
    responseTime?: number;
    statusCode?: number;
    responseData?: any;
  };
}

export const runNetworkTests = async (): Promise<NetworkTestResult[]> => {
  const results: NetworkTestResult[] = [];
  
  console.log('🧪 Starting comprehensive network tests...');
  console.log('📱 Platform:', Platform.OS);
  
  // Test 1: Basic connectivity test
  try {
    console.log('🔍 Test 1: Basic connectivity test');
    const startTime = Date.now();
    const response = await fetch('https://www.google.com/favicon.ico', { method: 'HEAD' });
    const endTime = Date.now();
    
    results.push({
      success: response.ok,
      details: {
        platform: Platform.OS,
        url: 'https://www.google.com/favicon.ico',
        method: 'HEAD',
        responseTime: endTime - startTime,
        statusCode: response.status,
      }
    });
    
    console.log('✅ Basic connectivity test:', response.ok ? 'PASSED' : 'FAILED');
  } catch (error) {
    results.push({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: {
        platform: Platform.OS,
        url: 'https://www.google.com/favicon.ico',
        method: 'HEAD',
      }
    });
    console.log('❌ Basic connectivity test: FAILED');
  }
  
  // Test 2: API endpoint test
  try {
    console.log('🔍 Test 2: API endpoint test');
    const startTime = Date.now();
    const response = await fetch('https://social-meta.onrender.com/api/v1/health', { 
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    const endTime = Date.now();
    
    let responseData;
    try {
      responseData = await response.text();
    } catch (e) {
      responseData = 'Unable to read response';
    }
    
    results.push({
      success: response.ok,
      details: {
        platform: Platform.OS,
        url: 'https://social-meta.onrender.com/api/v1/health',
        method: 'GET',
        responseTime: endTime - startTime,
        statusCode: response.status,
        responseData,
      }
    });
    
    console.log('✅ API endpoint test:', response.ok ? 'PASSED' : 'FAILED');
  } catch (error) {
    results.push({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: {
        platform: Platform.OS,
        url: 'https://social-meta.onrender.com/api/v1/health',
        method: 'GET',
      }
    });
    console.log('❌ API endpoint test: FAILED');
  }
  
  // Test 3: Axios instance test
  try {
    console.log('🔍 Test 3: Axios instance test');
    const startTime = Date.now();
    const response = await axiosInstance.get('/health');
    const endTime = Date.now();
    
    results.push({
      success: true,
      details: {
        platform: Platform.OS,
        url: '/health',
        method: 'GET',
        responseTime: endTime - startTime,
        statusCode: response.status,
        responseData: response.data,
      }
    });
    
    console.log('✅ Axios instance test: PASSED');
  } catch (error: any) {
    results.push({
      success: false,
      error: error.message || 'Unknown error',
      details: {
        platform: Platform.OS,
        url: '/health',
        method: 'GET',
        statusCode: error.response?.status,
        responseData: error.response?.data,
      }
    });
    console.log('❌ Axios instance test: FAILED');
  }
  
  // Test 4: FormData test (Android specific)
  if (Platform.OS === 'android') {
    try {
      console.log('🔍 Test 4: FormData test (Android)');
      const formData = new FormData();
      formData.append('test', 'test value');
      
      const startTime = Date.now();
      const response = await axiosInstance.post('/test-formdata', formData);
      const endTime = Date.now();
      
      results.push({
        success: true,
        details: {
          platform: Platform.OS,
          url: '/test-formdata',
          method: 'POST',
          responseTime: endTime - startTime,
          statusCode: response.status,
          responseData: response.data,
        }
      });
      
      console.log('✅ FormData test: PASSED');
    } catch (error: any) {
      results.push({
        success: false,
        error: error.message || 'Unknown error',
        details: {
          platform: Platform.OS,
          url: '/test-formdata',
          method: 'POST',
          statusCode: error.response?.status,
          responseData: error.response?.data,
        }
      });
      console.log('❌ FormData test: FAILED');
    }
  }
  
  // Print summary
  console.log('📊 Network Test Summary:');
  results.forEach((result, index) => {
    console.log(`Test ${index + 1}: ${result.success ? '✅ PASSED' : '❌ FAILED'}`);
    if (!result.success) {
      console.log(`   Error: ${result.error}`);
    }
    console.log(`   URL: ${result.details.url}`);
    console.log(`   Method: ${result.details.method}`);
    if (result.details.responseTime) {
      console.log(`   Response Time: ${result.details.responseTime}ms`);
    }
    if (result.details.statusCode) {
      console.log(`   Status Code: ${result.details.statusCode}`);
    }
  });
  
  return results;
};

export const showNetworkTestResults = (results: NetworkTestResult[]) => {
  const passedTests = results.filter(r => r.success).length;
  const totalTests = results.length;
  
  Toast.show({
    type: passedTests === totalTests ? 'success' : 'error',
    text1: `Network Tests: ${passedTests}/${totalTests} Passed`,
    text2: passedTests === totalTests ? 'All tests passed!' : 'Some tests failed. Check console for details.',
  });
  
  // Log detailed results
  console.log('🔍 Detailed Network Test Results:');
  results.forEach((result, index) => {
    console.log(`\n--- Test ${index + 1} ---`);
    console.log('Success:', result.success);
    console.log('Platform:', result.details.platform);
    console.log('URL:', result.details.url);
    console.log('Method:', result.details.method);
    if (result.details.responseTime) {
      console.log('Response Time:', result.details.responseTime + 'ms');
    }
    if (result.details.statusCode) {
      console.log('Status Code:', result.details.statusCode);
    }
    if (result.error) {
      console.log('Error:', result.error);
    }
    if (result.details.responseData) {
      console.log('Response Data:', result.details.responseData);
    }
  });
}; 