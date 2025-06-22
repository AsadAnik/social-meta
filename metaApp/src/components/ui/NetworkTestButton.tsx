import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { runNetworkTests, showNetworkTestResults } from '../../utils/networkTest';

const NetworkTestButton: React.FC = () => {
  const handleNetworkTest = async () => {
    console.log('🧪 Starting network tests...');
    try {
      const results = await runNetworkTests();
      showNetworkTestResults(results);
    } catch (error) {
      console.error('❌ Network test failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleNetworkTest}>
        <Text style={styles.buttonText}>🧪 Run Network Tests</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1000,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default NetworkTestButton; 