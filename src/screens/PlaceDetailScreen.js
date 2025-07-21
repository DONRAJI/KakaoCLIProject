// PlaceDetailScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PlaceDetailScreen = ({ route }) => {
  const { place } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{place.place_name || place.address_name}</Text>
      {place.road_address_name ? (
        <Text style={styles.text}>📍 도로명 주소: {place.road_address_name}</Text>
      ) : null}
      <Text style={styles.text}>📍 지번 주소: {place.address_name}</Text>
      <Text style={styles.text}>📞 전화번호: {place.phone || '정보 없음'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default PlaceDetailScreen;
