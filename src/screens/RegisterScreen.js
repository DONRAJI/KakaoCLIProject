import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';

const RegisterScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    email: '',
    name: '',
    age: '',
    phone: '',
    password: '',
    regionInput: '', 
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    try {
      const kakaoRes = await axios.get(
        `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(form.regionInput)}`,
        {
          headers: {
            Authorization: 'KakaoAK 47143c85474b6ee576fbdd249a01e5e1',
          },
        }
      );

      const address = kakaoRes.data.documents[0]?.address;

      if (!address) {
        Alert.alert('주소 오류', '입력한 주소를 찾을 수 없습니다.');
        return;
      }

      const region = `${address.region_1depth_name} ${address.region_2depth_name}${
        address.region_3depth_name ? ' ' + address.region_3depth_name : ''
      }`;

      const requestBody = {
        email: form.email,
        name: form.name,
        age: form.age,
        phone: form.phone.replace(/-/g, ''),
        password: form.password,
        region: region,
      };

      const response = await axios.post(
        'https://port-0-node-m5bzvrlhf1da1cc6.sel4.cloudtype.app/api/auth/register',
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      Alert.alert('회원가입 성공', '이제 로그인하세요!');
      navigation.navigate('Login');

    } catch (error) {
      console.error(error);
      Alert.alert('회원가입 실패', error.response?.data?.message || '오류가 발생했습니다.');
    }
  };

  return (
    <View style={{ padding: 20 }}>
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
        placeholder="전화번호 (01012345678)"
        value={form.phone}
        onChangeText={(text) => handleChange('phone', text)}
        keyboardType="phone-pad"
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="비밀번호"
        value={form.password}
        secureTextEntry
        onChangeText={(text) => handleChange('password', text)}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="주소 (예: 경기도 용인시 기흥구)"
        value={form.regionInput}
        onChangeText={(text) => handleChange('regionInput', text)}
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
      />
      <Button title="회원가입" onPress={handleSubmit} />
    </View>
  );
};

export default RegisterScreen;
