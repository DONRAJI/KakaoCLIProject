import React, { useState, useRef } from 'react';
import { View, TextInput, Button, Alert, FlatList, TouchableOpacity, Text, Keyboard } from 'react-native';
import axios from 'axios';

// 카카오 REST API KEY (환경변수로 관리 권장)
const KAKAO_REST_API_KEY = '47143c85474b6ee576fbdd249a01e5e1';

const RegisterScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    email: '',
    name: '',
    age: '',
    phone: '',
    password: '',
    regionInput: '',
  });
  const [addressResults, setAddressResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // debounce 방지용 ref
  const searchTimeout = useRef(null);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));

    if (key === 'regionInput') {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
      searchTimeout.current = setTimeout(() => {
        if (value.trim().length > 1) {
          console.log('[LOG] 주소 검색 시작:', value.trim());
          searchAddress(value.trim());
        } else {
          setAddressResults([]);
        }
      }, 500);
    }
  };

  // 카카오 주소 검색 API
  const searchAddress = async (query) => {
    setLoading(true);
    try {
      const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(query)}`;
      console.log('[LOG] 카카오 주소 API 호출:', url);
      const response = await axios.get(url, {
        headers: {
          Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
        },
      });
      setAddressResults(response.data.documents || []);
      console.log('[LOG] 주소 후보 개수:', response.data.documents.length);
    } catch (error) {
      setAddressResults([]);
      console.error('[ERROR] 주소 검색 실패:', error.message);
    }
    setLoading(false);
  };

  // 주소 후보 중 하나 선택 시
  const handleSelectAddress = (item) => {
    const region = `${item.address.region_1depth_name} ${item.address.region_2depth_name} ${item.address.region_3depth_name}`;
    setForm(prev => ({ ...prev, regionInput: region }));
    setAddressResults([]);
    Keyboard.dismiss();
    console.log('[LOG] 주소 선택:', region);
  };

  const parseRegion = (raw) => {
    const parts = raw.trim().split(/\s+/);
    if (parts.length < 3) {
      throw new Error('주소는 반드시 "시도 시군구 읍면동"의 3단계로 입력되어야 합니다.');
    }
    return `${parts[0]} ${parts[1]} ${parts[2]}`;
  };

  const handleSubmit = async () => {
    try {
      console.log('[LOG] 회원가입 시도');
      const region = parseRegion(form.regionInput);

      const requestBody = {
        email: form.email,
        name: form.name,
        age: parseInt(form.age, 10).toString(),
        phone: form.phone.replace(/-/g, ''),
        password: form.password,
        region: region,
      };
      console.log('[DEBUG] 전송할 데이터:', JSON.stringify(requestBody, null, 2));

      await axios.post(
        'https://port-0-node-m5bzvrlhf1da1cc6.sel4.cloudtype.app/api/auth/register',
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      Alert.alert('회원가입 성공', '이제 로그인해주세요!');
      navigation.navigate('Login');

    } catch (error) {
      if (error.message.includes('주소는 반드시')) {
        Alert.alert('주소 오류', error.message);
        return;
      }
      console.error('[ERROR] 회원가입 실패:', error.message);
      Alert.alert('회원가입 실패', error.response?.data?.message || '오류가 발생했습니다.');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="이메일"
        value={form.email}
        onChangeText={(text) => handleChange('email', text)}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="이름"
        value={form.name}
        onChangeText={(text) => handleChange('name', text)}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="나이"
        value={form.age}
        onChangeText={(text) => handleChange('age', text)}
        keyboardType="numeric"
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="전화번호 (예: 01012345678)"
        value={form.phone}
        onChangeText={(text) => handleChange('phone', text)}
        keyboardType="phone-pad"
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="비밀번호"
        value={form.password}
        onChangeText={(text) => handleChange('password', text)}
        secureTextEntry
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="주소 검색 (예: 경기 용인시)"
        value={form.regionInput}
        onChangeText={(text) => handleChange('regionInput', text)}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      {/* 주소 자동완성 리스트 */}
      {addressResults.length > 0 && (
        <FlatList
          data={addressResults}
          keyExtractor={(item) => item.address.address_name}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                paddingVertical: 8,
                borderBottomWidth: 0.5,
                borderColor: '#ccc',
                backgroundColor: '#fafafa'
              }}
              onPress={() => handleSelectAddress(item)}
            >
              <Text>{`${item.address.region_1depth_name} ${item.address.region_2depth_name} ${item.address.region_3depth_name}`}</Text>
            </TouchableOpacity>
          )}
          style={{
            maxHeight: 180,
            marginBottom: 10,
            borderWidth: 1,
            borderColor: '#eee',
            borderRadius: 4,
          }}
        />
      )}
      <Button title="회원가입" onPress={handleSubmit} />
    </View>
  );
};

export default RegisterScreen;
