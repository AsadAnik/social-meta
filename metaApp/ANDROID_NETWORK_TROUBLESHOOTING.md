# Android Network Troubleshooting Guide

## Issue: Network Error with FormData on Android Emulator

### Problem Description
You're experiencing network errors when making POST requests with FormData specifically on Android emulator, while iOS simulator works fine.

### Root Causes
1. **Android Network Security Configuration**: Android 9+ has stricter network security policies
2. **FormData Content-Type Handling**: Android handles FormData headers differently than iOS
3. **Emulator Network Configuration**: Android emulator has different network behavior

### Solutions Applied

#### 1. Network Security Configuration
- Created `android/app/src/main/res/xml/network_security_config.xml`
- Added `android:networkSecurityConfig="@xml/network_security_config"` to AndroidManifest.xml
- Added `android:usesCleartextTraffic="true"` for development

#### 2. Android Manifest Updates
- Added `ACCESS_NETWORK_STATE` permission
- Configured network security settings
- Enabled cleartext traffic for development

#### 3. Axios Configuration Updates
- Added Platform-specific FormData handling
- Removed Content-Type header for Android FormData requests
- Added timeout configuration
- Added debug logging for troubleshooting

#### 4. Post Slice Updates
- Updated FormData headers configuration
- Removed `formData: true` flag (not needed with proper headers)

### Debug Steps

1. **Check Console Logs**: Look for debug output starting with `=== NETWORK DEBUG INFO ===`

2. **Verify Network Security**: Ensure the network security config is properly applied

3. **Test with Different Content Types**:
   ```javascript
   // Test with simple text first
   const simpleData = { content: 'Test post' };
   
   // Then test with FormData
   const formData = new FormData();
   formData.append('content', 'Test post');
   ```

4. **Check Emulator Network**:
   - Ensure emulator has internet access
   - Try accessing the API URL in emulator browser
   - Check if the API is accessible from emulator

### Additional Troubleshooting

#### If Still Having Issues:

1. **Clear Build Cache**:
   ```bash
   cd android
   ./gradlew clean
   cd ..
   npx react-native run-android
   ```

2. **Check API Accessibility**:
   - Test API endpoint from emulator browser
   - Verify API is not blocking Android emulator requests

3. **Alternative FormData Approach**:
   ```javascript
   // Try this alternative approach
   const formData = new FormData();
   formData.append('content', postContent);
   
   if (selectedMedia) {
     formData.append('media', {
       uri: selectedMedia.uri,
       type: selectedMedia.type || 'image/jpeg',
       name: selectedMedia.fileName || 'media.jpg',
     });
   }
   ```

4. **Check for CORS Issues**:
   - Ensure your API allows requests from Android emulator
   - Check if API has proper CORS headers

### Common Android Emulator Issues

1. **Network Timeout**: Android emulator can be slower, increase timeout
2. **DNS Resolution**: Emulator might have DNS issues with certain domains
3. **SSL/TLS**: Emulator might have certificate issues

### Testing Checklist

- [ ] Network security config is applied
- [ ] Android manifest has proper permissions
- [ ] FormData headers are properly set
- [ ] API is accessible from emulator browser
- [ ] Console shows debug information
- [ ] No CORS errors in console
- [ ] Request reaches the server (check server logs)

### Next Steps

If the issue persists after applying these fixes:

1. Check the debug output in console
2. Verify API server logs for incoming requests
3. Test with a different API endpoint
4. Consider using a different network library (like fetch API)
5. Test on a physical Android device to isolate emulator-specific issues 