// screens/CommunityCreateScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '@env';
import { getAuth } from 'firebase/auth';

const CommunityCreateScreen = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleCreatePost = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('제목과 내용을 입력해주세요.');
      return;
    }
  
    const auth = getAuth();
    const currentUser = auth.currentUser;
  
    if (!currentUser) {
      Alert.alert('로그인이 필요합니다.');
      return;
    }
  
    const uid = currentUser.email; // 또는 uid
  
    // 🔍 콘솔 로그 추가
    console.log("📤 게시글 등록 요청:");
    console.log("uid:", uid);
    console.log("title:", title);
    console.log("content:", content);
  
    try {
      await axios.post(`${API_BASE_URL}/api/post`, {
        uid,
        title,
        content,
      });
  
      console.log("✅ 게시글 등록 성공");
      Alert.alert('게시글이 등록되었습니다!');
      navigation.goBack();
    } catch (error) {
      console.error("❌ 게시글 등록 실패", error);
      Alert.alert('게시글 등록 실패', error.message);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.label}>제목</Text>
      <TextInput
        style={styles.input}
        placeholder="제목을 입력하세요"
        value={title}
        onChangeText={setTitle}
      />
      <Text style={styles.label}>내용</Text>
      <TextInput
        style={styles.textarea}
        placeholder="내용을 입력하세요"
        value={content}
        onChangeText={setContent}
        multiline
      />
      <Button title="등록하기" onPress={handleCreatePost} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    flex: 1,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 16,
    borderRadius: 6,
  },
  textarea: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    height: 150,
    marginBottom: 16,
    borderRadius: 6,
    textAlignVertical: 'top',
  },
});

export default CommunityCreateScreen;
