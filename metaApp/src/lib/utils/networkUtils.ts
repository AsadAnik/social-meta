import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';

let isNetworkErrorShown: boolean = false;

/**
 * Check network connectivity
 * @returns Promise<boolean> - true if connected, false if offline
 */
export const checkNetworkConnectivity = async (): Promise<boolean> => {
  try {
    const state = await NetInfo.fetch();
    return state.isConnected === true && state.isInternetReachable === true;
  } catch (error) {
    console.error('Error checking network connectivity:', error);
    return false;
  }
};

/**
 * Show network error notification
 */
export const showNetworkError = () => {
  if (!isNetworkErrorShown) {
    isNetworkErrorShown = true;
    Toast.show({
      type: 'error',
      text1: 'No Internet Connection',
      text2: 'Please check your network connection and try again.',
      position: 'top',
      visibilityTime: 4000,
    });
    
    // Reset flag after 5 seconds to allow showing again
    setTimeout(() => {
      isNetworkErrorShown = false;
    }, 5000);
  }
};

/**
 * Show network restored notification
 */
export const showNetworkRestored = () => {
  Toast.show({
    type: 'success',
    text1: 'Connection Restored',
    text2: 'You are back online!',
    position: 'top',
    visibilityTime: 3000,
  });
};

/**
 * Initialize network connectivity listener
 */
export const initializeNetworkListener = () => {
  let wasOffline = false;
  
  NetInfo.addEventListener(state => {
    const isOnline = state.isConnected === true && state.isInternetReachable === true;
    
    if (!isOnline && !wasOffline) {
      wasOffline = true;
      showNetworkError();
    } else if (isOnline && wasOffline) {
      wasOffline = false;
      showNetworkRestored();
    }
  });
};

/**
 * Get current network state
 * @returns Promise<NetInfo.NetInfoState>
 */
export const getCurrentNetworkState = async () => {
  return await NetInfo.fetch();
};

/**
 * Check if user is on WiFi
 * @returns Promise<boolean>
 */
export const isOnWifi = async (): Promise<boolean> => {
  const state = await NetInfo.fetch();
  return state.type === 'wifi';
};

/**
 * Check if user is on cellular data
 * @returns Promise<boolean>
 */
export const isOnCellular = async (): Promise<boolean> => {
  const state = await NetInfo.fetch();
  return state.type === 'cellular';
};

/**
 * Show network type notification
 */
export const showNetworkTypeInfo = async () => {
  const state = await NetInfo.fetch();
  let networkType = 'Unknown';
  
  if (state.type === 'wifi') {
    networkType = 'WiFi';
  } else if (state.type === 'cellular') {
    networkType = 'Cellular Data';
  } else if (state.type === 'none') {
    networkType = 'No Connection';
  }
  
  Toast.show({
    type: 'info',
    text1: 'Network Status',
    text2: `Connected via ${networkType}`,
    position: 'top',
    visibilityTime: 3000,
  });
}; 