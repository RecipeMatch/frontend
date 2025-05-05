// screens/CommunityDetailScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import CommentItem from './CommentItem';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '@env';

const CommunityDetailScreen = ({ route }) => {
  const { post, isMyPost } = route.params;
  const navigation = useNavigation();

  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const currentUser = auth.currentUser;

  const fetchComments = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/post/${post.postId}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error('❌ 댓글 불러오기 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentInput.trim()) return;

    try {
      await axios.post(`${API_BASE_URL}/api/post/${post.postId}/comment`, {
        uid: currentUser.email,
        content: commentInput,
      });
      setCommentInput('');
      await fetchComments(); // ✅ 등록 후 서버에서 최신 댓글 가져오기
    } catch (err) {
      console.error('❌ 댓글 등록 실패:', err);
      Alert.alert('댓글 등록 실패', err.message);
    }
  };

  const handleDelete = async () => {
    Alert.alert('삭제 확인', '정말 이 게시글을 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`${API_BASE_URL}/api/post/${post.postId}`);
            Alert.alert('삭제 완료');
            navigation.goBack();
          } catch (error) {
            console.error('❌ 삭제 실패:', error);
            Alert.alert('삭제 실패', error.message);
          }
        },
      },
    ]);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.uid}>작성자: {post.uid || post.user?.email}</Text>
      <Text style={styles.content}>{post.content}</Text>

      {isMyPost && (
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('CommunityEdit', { post })}
          >
            <Text style={styles.buttonText}>수정</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.buttonText}>삭제</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.commentTitle}>💬 댓글</Text>

      <FlatList
  data={comments}
  keyExtractor={(item, index) => {
    return item.commentId ? String(item.commentId) : `comment-${index}`;
  }}
  renderItem={({ item }) => (
    <CommentItem
      comment={item}
      currentUserUid={currentUser?.email}
      onRefresh={fetchComments}
    />
  )}
  ListEmptyComponent={
    <Text style={{ color: '#888', marginTop: 8 }}>댓글이 없습니다.</Text>
  }
/>


      <TextInput
        style={styles.commentInput}
        placeholder="댓글을 입력하세요"
        value={commentInput}
        onChangeText={setCommentInput}
      />
      <TouchableOpacity style={styles.commentButton} onPress={handleAddComment}>
        <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>
          댓글 등록
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CommunityDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  uid: { fontSize: 14, color: '#888', marginBottom: 20 },
  content: { fontSize: 16, lineHeight: 24 },
  buttonRow: { flexDirection: 'row', marginTop: 30, justifyContent: 'space-between' },
  editButton: { backgroundColor: '#1FCC79', padding: 12, borderRadius: 6, width: '48%' },
  deleteButton: { backgroundColor: '#FF6B6B', padding: 12, borderRadius: 6, width: '48%' },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  commentTitle: { marginTop: 30, fontSize: 18, fontWeight: 'bold' },
  commentItem: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 6,
  },
  commentUid: { fontSize: 13, color: '#666', marginBottom: 4 },
  commentInput: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
  },
  commentButton: {
    marginTop: 10,
    backgroundColor: '#1FCC79',
    padding: 10,
    borderRadius: 6,
  },
});
