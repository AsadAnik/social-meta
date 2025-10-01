# Network Connectivity Features

This document explains how to use the network connectivity features implemented in the app.

## Overview

The app now includes comprehensive network connectivity detection and user notifications. When users are offline, they will receive notifications, and when they come back online, they'll be notified as well.

## Features

### 1. Automatic Network Detection
- Real-time network connectivity monitoring
- Automatic notifications when going offline/online
- Prevents API calls when offline
- Handles various network error types

### 2. User Notifications
- **Offline Notification**: Shows when user loses internet connection
- **Online Notification**: Shows when user regains internet connection
- **Network Type Info**: Shows current connection type (WiFi/Cellular)
- **Error Notifications**: Timeout, server errors, and network errors

### 3. API Request Protection
- Checks network connectivity before making API calls
- Prevents failed requests when offline
- Shows appropriate error messages

## Usage

### Basic Network Status Hook

```typescript
import { useNetworkStatus } from '../hooks/useNetworkStatus';

const MyComponent = () => {
  const { isOnline, isConnected, type, checkConnection } = useNetworkStatus();

  return (
    <View>
      <Text>Status: {isOnline ? 'Online' : 'Offline'}</Text>
      <Text>Type: {type}</Text>
      <Button title="Check Connection" onPress={checkConnection} />
    </View>
  );
};
```

### Network Utilities

```typescript
import { 
  checkNetworkConnectivity, 
  showNetworkError, 
  showNetworkRestored,
  showNetworkTypeInfo 
} from '../lib/utils/networkUtils';

// Check if connected
const isConnected = await checkNetworkConnectivity();

// Show network error
showNetworkError();

// Show network restored
showNetworkRestored();

// Show network type info
await showNetworkTypeInfo();
```

### Network Status Indicator Component

```typescript
import NetworkStatusIndicator from '../components/ui/NetworkStatusIndicator';

const MyScreen = () => {
  return (
    <View>
      <NetworkStatusIndicator />
      {/* Your other components */}
    </View>
  );
};
```

## Error Handling

The axios interceptor automatically handles various network errors:

### 1. Network Connectivity Errors
- Detects when user is offline
- Shows "No Internet Connection" notification
- Prevents API calls when offline

### 2. Timeout Errors
- Shows "Request Timeout" notification
- Occurs when requests take too long

### 3. Server Errors (5xx)
- Shows "Server Error" notification
- Handles backend issues gracefully

### 4. Network Type Detection
- WiFi vs Cellular data detection
- Connection quality monitoring

## Configuration

### Toast Notifications
Network notifications use the existing Toast system with these settings:
- Position: Top
- Visibility Time: 3-4 seconds
- Types: error, success, info

### Network Check Frequency
- Real-time monitoring via NetInfo
- Pre-request connectivity checks
- Automatic retry mechanisms

## Dependencies

- `@react-native-community/netinfo`: Network connectivity detection
- `react-native-toast-message`: User notifications
- Existing axios setup: Request/response interception

## Best Practices

1. **Always check connectivity before API calls**:
   ```typescript
   const isConnected = await checkNetworkConnectivity();
   if (!isConnected) {
     // Handle offline state
     return;
   }
   ```

2. **Use the network status hook in components**:
   ```typescript
   const { isOnline } = useNetworkStatus();
   if (!isOnline) {
     return <OfflineMessage />;
   }
   ```

3. **Handle network errors gracefully**:
   ```typescript
   try {
     const response = await apiCall();
   } catch (error) {
     // Network errors are already handled by interceptor
     // Handle other errors here
   }
   ```

## Testing

### Simulate Offline Mode
1. Turn off WiFi and cellular data
2. Try to make an API call
3. Verify offline notification appears
4. Turn network back on
5. Verify online notification appears

### Test Network Types
1. Switch between WiFi and cellular
2. Use the NetworkStatusIndicator component
3. Check network type notifications

## Troubleshooting

### Common Issues

1. **Notifications not showing**: Ensure Toast is properly configured in App.tsx
2. **Network detection not working**: Check NetInfo permissions in Android/iOS
3. **API calls still going through**: Verify axios interceptor is properly configured

### Debug Information
- Check console logs for network debug information
- Use the NetworkStatusIndicator component for visual feedback
- Monitor Toast notifications for user feedback

## Future Enhancements

1. **Offline Queue**: Queue requests when offline and retry when online
2. **Connection Quality**: Monitor connection speed and quality
3. **Background Sync**: Sync data when connection is restored
4. **Network Preferences**: Allow users to set network preferences 