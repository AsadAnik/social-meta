import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ChatTabScreen from '../../screens/stacks/ChatScreen';

const FollowersTab: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Followers Tab Content</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FollowersTab;

