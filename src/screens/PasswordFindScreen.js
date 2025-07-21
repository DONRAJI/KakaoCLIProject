import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

const PasswordFindScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  const handleResetPassword = async () => {
    if (!email || !name || !phone || !newPassword || !newPasswordConfirm) {
      Alert.alert('입력 오류', '모든 항목을 입력해주세요.');
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      Alert.alert('입력 오류', '새 비밀번호와 확인이 일치하지 않습니다.');
      return;
    }

    try {
      await axios.post(
        'https://port-0-backend-server-m5bzvrlhf1da1cc6.sel4.cloudtype.app/api/auth/reset-password',
        {
          email,
          name,
          phone: phone.replace(/-/g, ''),
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
    <View style={styles.container}>
      <TextInput
        placeholder="이메일"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="이름"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="전화번호 (01012345678)"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={styles.input}
      />
      <TextInput
        placeholder="새 비밀번호"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        placeholder="새 비밀번호 확인"
        value={newPasswordConfirm}
        onChangeText={setNewPasswordConfirm}
        secureTextEntry
        style={styles.input}
      />
      <Button title="비밀번호 변경" onPress={handleResetPassword} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  input: {
    borderBottomWidth: 1,
    marginBottom: 15,
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
});

export default PasswordFindScreen;