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
    setForm(prev => ({ ...prev, [key]: value }));
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
      const region = parseRegion(form.regionInput);
      console.log('[DEBUG] 사용자 입력 regionInput:', form.regionInput);
      console.log('[DEBUG] 파싱된 region:', region);

      const requestBody = {
        email: form.email,
        name: form.name,
        age: parseInt(form.age, 10),
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
      if (error.response) {
        console.error('[ERROR] 응답 데이터:', JSON.stringify(error.response.data, null, 2));
      }
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
