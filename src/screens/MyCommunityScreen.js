import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import { API_BASE_URL } from '@env';
import { useNavigation } from '@react-navigation/native';

const MyCommunityScreen = () => {
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const auth = getAuth();
  const currentUser = auth.currentUser;

  const fetchMyPosts = async () => {
    if (!currentUser) return;

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/users/posts`,
        {
          params: {
            uid: currentUser.email, // 또는 currentUser.uid, 백엔드 기준 확인
          },
        }
      );

      // null 값 필터링하여 상태에 저장
      const filteredPosts = response.data.filter(post => post != null);
      setMyPosts(filteredPosts);
    } catch (error) {
      console.error('❌ 나의 게시글 불러오기 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchMyPosts);
    return unsubscribe;
  }, [navigation]);

  // 게시글 항목 렌더링
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('CommunityDetail', { post: item, isMyPost: true, })}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.content}>{item.content}</Text>
      <Text style={styles.email}>작성자: {item.uid || '나'}</Text>
    </TouchableOpacity>
  );

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={myPosts}
        keyExtractor={(item) => item.postId ? String(item.postId) : String(item.id)} // 고유한 키값 사용
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            작성한 게시글이 없습니다.
          </Text>
        }
      />
    </View>
  );
};

export default MyCommunityScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  content: {
    fontSize: 15,
    color: '#333',
  },
  email: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
  },
});
