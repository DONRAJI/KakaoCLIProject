import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';

const PasswordFindStep2 = ({ route, navigation }) => {
  const { token } = route.params;
  const [newPassword, setNewPassword] = useState('');

  const handleResetPassword = async () => {
    try {
      await axios.post(
        'https://port-0-backend-server-m5bzvrlhf1da1cc6.sel4.cloudtype.app/api/auth/reset-password',
        {
          token,
          newPassword,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      Alert.alert('비밀번호 변경 완료', '이제 로그인할 수 있습니다.');
      navigation.navigate('Login');

    } catch (error) {
      console.error(error);
      Alert.alert('오류', error.response?.data?.message || '비밀번호 변경 실패');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="새 비밀번호"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
      /> 
      <Button title="비밀번호 변경" onPress={handleResetPassword} />
    </View>
  );
};

export default PasswordFindStep2;
