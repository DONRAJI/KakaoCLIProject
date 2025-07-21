import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, Alert } from 'react-native';
import { login, getProfile } from '@react-native-seoul/kakao-login';

const SocialLoginButton = ({ onPress, style }) => {
  const handleKakaoLogin = async () => {
    console.log('카카오 로그인 버튼 클릭됨'); // 로그 추가
    console.log('현재 앱에서 사용하는 키 해시:', 'Y9ySLpFejs2sqy6FoYHEGVnHIMk=');
    try {
      const token = await login();
      console.log('카카오 로그인 성공:', token);

      const profile = await getProfile();
      console.log('사용자 프로필:', profile);

      Alert.alert('로그인 성공', `환영합니다, ${profile.nickname}!`);
    } catch (error) {
      console.error('카카오 로그인 실패:', error);
      Alert.alert('로그인 실패', '카카오 로그인 중 문제가 발생했습니다.');
    }
  };

  return (
    <TouchableOpacity
      onPress={handleKakaoLogin}
      style={[
        styles.button,
        {
          backgroundColor: '#FEE500',
          borderColor: '#FEE500',
        },
        style,
      ]}
    >
      <Image source={require('../../assets/kakao.png')} style={styles.icon} />
      <Text style={[styles.text, { color: '#000' }]}>Kakao로 로그인</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 12,
    resizeMode: 'contain',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SocialLoginButton;