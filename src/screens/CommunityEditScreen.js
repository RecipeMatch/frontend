// screens/CommunityEditScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '@env';

const CommunityEditScreen = ({ route }) => {
  const { post } = route.params;
  const navigation = useNavigation();

  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  const handleUpdate = async () => {
    try {
      await axios.put(`${API_BASE_URL}/api/post`, {
        postId: post.postId,
        title,
        content,
        uid: post.uid, // 필요 시 포함
      });

      Alert.alert('수정 완료!', '게시글이 성공적으로 수정되었습니다.');
      navigation.goBack(); // 이전 화면으로 이동
    } catch (error) {
      console.error("❌ 수정 실패:", error);
      Alert.alert('수정 실패', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>제목</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>내용</Text>
      <TextInput
        style={styles.textarea}
        value={content}
        onChangeText={setContent}
        multiline
      />

      <Button title="수정 완료" onPress={handleUpdate} />
    </View>
  );
};

export default CommunityEditScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 16,
  },
  textarea: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    height: 150,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
});
