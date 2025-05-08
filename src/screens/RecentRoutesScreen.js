import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RecentRoutesScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🕓 최근 경로 화면입니다.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
  },
});

export default RecentRoutesScreen;