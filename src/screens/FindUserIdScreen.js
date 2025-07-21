import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import { use } from 'react';

const FindUserIdScreen = () => {
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const isFocused = useIsFocused();

  const handleFindUserId = async () => {
    if (!isFocused) return;

    if (!userName || !userPhone) {
      Alert.alert('입력 오류', '이름과 전화번호를 모두 입력해주세요.');
      return;
    }

    const phoneRegex = /^\d{1,15}$/;
    if (!phoneRegex.test(userPhone)) {
      Alert.alert('입력 오류', '전화번호는 최대 15자리 숫자로만 입력해주세요.');
      return;
    }

    console.log('입력값 확인:', { userName, userPhone });

try {
  const response = await axios.post(
    'https://port-0-backend-server-m5bzvrlhf1da1cc6.sel4.cloudtype.app/api/auth/find-id',
    {
      name: userName,
      phone: userPhone,
    }
  );
  const { email } = response.data;
  Alert.alert('아이디 찾기 성공', `회원님의 아이디는: ${email}`);
} catch (error) {
  console.error('에러 발생:', error);

  if (error.response?.status === 400) {
    const serverErrors = error.response.data.errors;
    console.error('에러 발생:', error);
    console.log('서버 응답:', error.response?.data);
    if (serverErrors) {
      const messages = serverErrors.map(err => err.msg).join('\n');
      Alert.alert('유효성 오류', messages);
    } else {
      Alert.alert('오류', error.response.data.error || '알 수 없는 오류');
    }
  } else {
    Alert.alert('서버 오류', '아이디를 찾는 중 오류가 발생했습니다.');
  }
}
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>이름</Text>
      <TextInput
        style={styles.input}
        placeholder="이름을 입력하세요"
        value={userName}
        onChangeText={setUserName}
      />
      <Text style={styles.label}>전화번호 (하이픈 없이)</Text>
      <TextInput
        style={styles.input}
        placeholder="01012345678"
        keyboardType="numeric"
        value={userPhone}
        onChangeText={setUserPhone}
      />
      <Button title="아이디 찾기" onPress={handleFindUserId} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  label: { marginTop: 15, fontSize: 16, fontWeight: 'bold' },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
  },
});

export default FindUserIdScreen;