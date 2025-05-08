import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, Alert } from 'react-native';
import { login, logout, getProfile } from '@react-native-seoul/kakao-login';

const getButtonStyle = (type) => {
  switch (type) {
    case 'kakao':
      return {
        backgroundColor: '#FEE500',
        borderColor: '#FEE500',
        textColor: '#000',
        icon: require('../../assets/kakao.png'),
        label: 'Kakao로 로그인',
      };
    default:
      return {
        backgroundColor: '#fff',
        borderColor: '#ccc',
        textColor: '#000',
        icon: null,
        label: '소셜 로그인',
      };
  }
};

const SocialLoginButton = ({ type = 'kakao', onPress, style }) => {
  const { backgroundColor, borderColor, textColor, icon, label } = getButtonStyle(type);

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
      onPress={type === 'kakao' ? handleKakaoLogin : onPress}
      style={[
        styles.button,
        {
          backgroundColor,
          borderColor,
        },
        style,
      ]}
    >
      {icon && <Image source={icon} style={styles.icon} />}
      <Text style={[styles.text, { color: textColor }]}>{label}</Text>
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