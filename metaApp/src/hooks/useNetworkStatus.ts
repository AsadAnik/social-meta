import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { checkNetworkConnectivity, showNetworkError } from '../lib/utils/networkUtils';

interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean;
  type: string;
  isOnline: boolean;
}

export const useNetworkStatus = () => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isConnected: true,
    isInternetReachable: true,
    type: 'unknown',
    isOnline: true,
  });

  useEffect(() => {
    // Get initial network status
    const getInitialStatus = async () => {
      const isConnected = await checkNetworkConnectivity();
      const state = await NetInfo.fetch();
      
      setNetworkStatus({
        isConnected: state.isConnected || false,
        isInternetReachable: state.isInternetReachable || false,
        type: state.type || 'unknown',
        isOnline: isConnected,
      });
    };

    getInitialStatus();

    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener((state) => {
      const isOnline = state.isConnected === true && state.isInternetReachable === true;
      
      setNetworkStatus({
        isConnected: state.isConnected || false,
        isInternetReachable: state.isInternetReachable || false,
        type: state.type || 'unknown',
        isOnline,
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const checkConnection = async () => {
    const isConnected = await checkNetworkConnectivity();
    if (!isConnected) {
      showNetworkError();
    }
    return isConnected;
  };

  return {
    ...networkStatus,
    checkConnection,
  };
}; 