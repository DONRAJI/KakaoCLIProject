import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native';
import axios from 'axios';
import SocialLoginButton from '../components/SocialLoginButton'; // SocialLoginButton 가져오기

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('입력 오류', '이메일과 비밀번호를 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post('https://port-0-node-m5bzvrlhf1da1cc6.sel4.cloudtype.app/api/auth/login', {
        email: email,
        password: password,
      });
  
      const data = response.data;
  
      if (data.token) {
        Alert.alert('환영합니다', '로그인에 성공했습니다!');
        navigation.navigate('Home');
      } else {
        Alert.alert('로그인 실패', data.message || '로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('로그인 오류:', error.response?.data || error.message);
  
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || '알 수 없는 오류가 발생했습니다.';
  
        if (status === 400) {
          Alert.alert('로그인 실패', '입력한 이메일 또는 비밀번호가 잘못되었습니다.');
        } else if (status === 401) {
          Alert.alert('로그인 실패', '인증에 실패했습니다. 다시 시도해주세요.');
        } else {
          Alert.alert('로그인 실패', message);
        }
      } else {
        // 네트워크 오류 또는 기타 오류 처리
        Alert.alert('서버 오류', '서버와 연결할 수 없습니다.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>로그인</Text>

      <TextInput
        style={styles.input}
        placeholder="이메일"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="로그인" onPress={handleLogin} />

      <View style={styles.linkContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>회원가입</Text>
        </TouchableOpacity>
        <Text style={styles.divider}> | </Text>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.link}>비밀번호 찾기</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.socialContainer}>
        <SocialLoginButton type="kakao" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  link: {
    color: '#007BFF',
    fontSize: 14,
  },
  divider: {
    marginHorizontal: 5,
    color: '#888',
  },
  socialContainer: {
    marginTop: 30,
  },
});

export default LoginScreen;