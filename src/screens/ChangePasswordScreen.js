import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

const ChangePasswordScreen = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      Alert.alert('입력 오류', '모든 필드를 입력해주세요.');
      return;
    }

    try {
      // 인증 토큰 가져오기 (예: AsyncStorage 또는 Context에서 가져오기)
      const token = 'YOUR_AUTH_TOKEN'; // 실제로는 AsyncStorage 또는 Context에서 가져와야 함

      const response = await axios.patch(
        'https://port-0-backend-server-m5bzvrlhf1da1cc6.sel4.cloudtype.app/api/auth/password',
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // 인증 토큰 추가 
          },
        }
      );

      Alert.alert('성공', '비밀번호가 성공적으로 변경되었습니다.');
      navigation.goBack(); // 이전 화면으로 이동
    } catch (error) {
      console.error('비밀번호 변경 오류:', error.response?.data || error.message);
      Alert.alert('오류', error.response?.data?.message || '비밀번호 변경 중 문제가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="현재 비밀번호"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="새 비밀번호"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <Button title="비밀번호 변경" onPress={handleChangePassword} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
});

export default ChangePasswordScreen;