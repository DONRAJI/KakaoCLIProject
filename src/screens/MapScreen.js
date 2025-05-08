import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const MapScreen = () => {
  const [address, setAddress] = useState(''); // 사용자가 입력한 주소
  const [searchAddress, setSearchAddress] = useState(''); // 검색할 주소

  const handleSearch = () => {
    setSearchAddress(address); // 검색 버튼 클릭 시 입력된 주소를 설정
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>카카오 지도</title>
        <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_JAVASCRIPT_KEY&libraries=services"></script>
      </head>
      <body>
        <div id="map" style="width:100%;height:100%;"></div>
        <script>
          var mapContainer = document.getElementById('map'); // 지도를 표시할 div
          var mapOption = {
            center: new kakao.maps.LatLng(37.5665, 126.9780), // 기본 좌표 (서울)
            level: 3 // 확대 레벨
          };

          var map = new kakao.maps.Map(mapContainer, mapOption); // 지도 생성

          var geocoder = new kakao.maps.services.Geocoder();

          // 주소로 좌표 검색
          geocoder.addressSearch('${searchAddress}', function(result, status) {
            if (status === kakao.maps.services.Status.OK) {
              var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
              map.setCenter(coords); // 지도 중심 이동

              var marker = new kakao.maps.Marker({
                map: map,
                position: coords
              });
            } else {
              alert('주소를 찾을 수 없습니다.');
            }
          });
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="주소를 입력하세요"
        value={address}
        onChangeText={setAddress}
      />
      <Button title="검색" onPress={handleSearch} />
      <WebView
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={styles.map}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  map: {
    flex: 1,
  },
});

export default MapScreen;