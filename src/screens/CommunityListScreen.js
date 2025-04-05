import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '@env';

const CommunityListScreen = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 게시글 목록 불러오기
  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/post`);
      console.log('전체 게시글 데이터:', response.data); // 데이터 확인
      // null 값 필터링하여 상태에 저장
      const filteredPosts = response.data.filter(post => post != null);
      setPosts(filteredPosts);
    } catch (error) {
      console.error('❌ 게시글 목록 불러오기 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchPosts);
    return unsubscribe;
  }, [navigation]);

  // 게시글 항목 렌더링
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('CommunityDetail', {
          post: item,
          isMyPost: false, // 🔑 전체 글에서는 수정/삭제 비활성화
        })
      }
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.content}>{item.content}</Text>
      <Text style={styles.email}>작성자: {item.uid}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.postId ? String(item.postId) : String(item.id)} // 고유한 키값 사용
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            게시글이 없습니다.
          </Text>
        }
      />
    </View>
  );
};

export default CommunityListScreen;

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
