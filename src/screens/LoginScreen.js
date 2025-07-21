import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Input, Button, Text, Divider } from 'react-native-elements';
import axios from 'axios';
import SocialLoginButton from '../components/SocialLoginButton'; // 소셜 로그인 버튼

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('입력 오류', '이메일과 비밀번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        'https://port-0-backend-server-m5bzvrlhf1da1cc6.sel4.cloudtype.app/api/auth/login',
        { email, password }
      );

      const data = response.data;

      if (data.token) {
        Alert.alert('환영합니다', '로그인에 성공했습니다!');
        navigation.replace('MainTab');
      } else {
        Alert.alert('로그인 실패', data.message || '로그인에 실패했습니다.');
      }
    } catch (error) {
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
        Alert.alert('서버 오류', '서버와 연결할 수 없습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text h3 style={styles.title}>로그인</Text>

      <Input
        placeholder="이메일"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        leftIcon={{ type: 'feather', name: 'mail', color: '#888' }}
        autoCapitalize="none"
        autoCorrect={false}
        containerStyle={styles.inputContainer}
      />

      <Input
        placeholder="비밀번호"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        leftIcon={{ type: 'feather', name: 'lock', color: '#888' }}
        containerStyle={styles.inputContainer}
      />

      <Button
        title="로그인"
        onPress={handleLogin}
        loading={loading}
        buttonStyle={styles.loginButton}
        containerStyle={{ marginBottom: 10 }}
      />

      <View style={styles.linkContainer}>
        <Text
          style={styles.link}
          onPress={() => navigation.navigate('Register')}
        >
          회원가입
        </Text>
        <Divider orientation="vertical" width={1} style={styles.divider} />
        <Text
          style={styles.link}
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          비밀번호 찾기
        </Text>
        <Divider orientation="vertical" width={1} style={styles.divider} />
        <Text
          style={styles.link}
          onPress={() => navigation.navigate('FindUserId')} // 아이디 찾기 화면으로 이동
        >
          아이디 찾기
        </Text>
      </View>

      <Divider style={{ marginVertical: 25 }} />

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
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    height: 48,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  link: {
    color: '#007BFF',
    fontSize: 14,
    marginHorizontal: 6,
  },
  divider: {
    height: 16,
    marginHorizontal: 3,
    backgroundColor: '#ccc',
  },
  socialContainer: {
    alignItems: 'center',
  },
});

export default LoginScreen;