import React, { useEffect, useState } from 'react';
import { View, Button, StyleSheet, FlatList, TouchableOpacity, Text, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { WebView } from 'react-native-webview';

const REST_API_KEY = '47143c85474b6ee576fbdd249a01e5e1';
const CATEGORY_CODE = 'FD6';
const RADIUS = 1000;

const MapScreen = () => {
  const [myCoords, setMyCoords] = useState(null);
  const [places, setPlaces] = useState([]);

const fetchAllPlaces = async (categoryCode, x, y, radius, maxPages = 5) => {
  let allResults = [];
  let page = 1;
  let isEnd = false;

  while (!isEnd && page <= maxPages) {
    const url = `https://dapi.kakao.com/v2/local/search/category.json?category_group_code=${categoryCode}&x=${x}&y=${y}&radius=${radius}&page=${page}&size=15`;
    const res = await fetch(url, {
      headers: { Authorization: `KakaoAK ${REST_API_KEY}` }
    });
    const data = await res.json();

    if (data.documents) {
      allResults = allResults.concat(data.documents);

      console.log(`페이지 ${page} 결과:`);
      data.documents.forEach((place, idx) => {
        console.log(
          `${idx + 1}. 장소명: ${place.place_name}, 카테고리: ${place.category_name}, 주소: ${place.road_address_name || place.address_name}, 전화: ${place.phone}, id: ${place.id}`
        );
      });
    }

    isEnd = data.meta.is_end;
    page++;
  }

  return allResults;
};

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

useEffect(() => {
  (async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      console.log('위치 권한이 거부됨');
      return;
    }

    Geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setMyCoords({ x: longitude, y: latitude });

try {
  const allPlaces = await fetchAllPlaces(CATEGORY_CODE, longitude, latitude, RADIUS);
  console.log('전체 장소 개수:', allPlaces.length);

  console.log('=== 상위 5개 장소 요약 ===');
  allPlaces.slice(0, 5).forEach((place, i) => {
    console.log(
      `${i + 1}. 장소명: ${place.place_name}, 거리: ${place.distance}, 주소: ${place.road_address_name || place.address_name}`
    );
  });

  setPlaces(allPlaces);
} catch (e) {
  console.log('장소 검색 중 오류:', e);
}
      },
      (error) => {
        console.log('위치 정보 수신 실패:', error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  })();
}, []);

  const generateMapHTML = (coords, markers) => {
    if (!coords) return '<html><body><h3>위치 정보를 불러오는 중입니다...</h3></body></html>';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Nearby Places</title>
        <style>html, body, #map { height: 100%; margin: 0; }</style>
        <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${REST_API_KEY}&autoload=false"></script>
      </head>
      <body>
        <div id="map"></div>
        <script>
          kakao.maps.load(() => {
            const container = document.getElementById('map');
            const options = {
              center: new kakao.maps.LatLng(${coords.y}, ${coords.x}),
              level: 3
            };
            const map = new kakao.maps.Map(container, options);

            new kakao.maps.Marker({
              position: new kakao.maps.LatLng(${coords.y}, ${coords.x}),
              map: map,
              title: '현재 위치'
            });

            ${markers.map(p => `
              new kakao.maps.Marker({
                position: new kakao.maps.LatLng(${p.y}, ${p.x}),
                map: map,
                title: '${p.place_name.replace(/'/g, "\\'")}'
              });
            `).join('\n')}
          });
        </script>
      </body>
      </html>
    `;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}> 주변 식당 목록</Text>
      <FlatList
        data={places}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item}>
            <Text>{item.place_name}</Text>
            <Text style={styles.address}>{item.road_address_name || item.address_name}</Text>
          </TouchableOpacity>
        )}
        style={styles.list}
      />
      <WebView
        originWhitelist={['*']}
        source={{ html: generateMapHTML(myCoords, places) }}
        style={styles.map}
        javaScriptEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 10 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  list: {
  maxHeight: 600,
  marginBottom: 10,
},
  item: { padding: 8, borderBottomColor: '#ddd', borderBottomWidth: 1 },
  address: { color: '#555', fontSize: 12 },
  map: { flex: 1 },
});

export default MapScreen;
