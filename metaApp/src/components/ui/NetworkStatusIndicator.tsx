import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { showNetworkTypeInfo } from '../../lib/utils/networkUtils';

const NetworkStatusIndicator: React.FC = () => {
  const { isOnline, checkConnection } = useNetworkStatus();

  const handlePress = async () => {
    await showNetworkTypeInfo();
  };

  const handleCheckConnection = async () => {
    await checkConnection();
  };

  if (isOnline) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.onlineIndicator} onPress={handlePress}>
          <View style={styles.dot} />
          <Text style={styles.text}>Online</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.checkButton} onPress={handleCheckConnection}>
          <Text style={styles.checkButtonText}>Check</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.offlineIndicator} onPress={handlePress}>
        <View style={[styles.dot, styles.offlineDot]} />
        <Text style={[styles.text, styles.offlineText]}>Offline</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.checkButton} onPress={handleCheckConnection}>
        <Text style={styles.checkButtonText}>Check</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 20,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  onlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  offlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  offlineDot: {
    backgroundColor: '#F44336',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  offlineText: {
    color: '#F44336',
  },
  checkButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  checkButtonText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
});

export default NetworkStatusIndicator; 