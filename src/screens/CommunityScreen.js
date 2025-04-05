// screens/CommunityScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const CommunityScreen = () => {
  const navigation = useNavigation();

  const handleGoToCreate = () => {
    navigation.navigate('CommunityCreate');
  };

  const handleGoToList = () => {
    navigation.navigate('CommunityList');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>커뮤니티</Text>

      <TouchableOpacity style={styles.button} onPress={handleGoToCreate}>
        <Ionicons name="create-outline" size={20} color="#fff" style={{ marginRight: 6 }} />
        <Text style={styles.buttonText}>게시글 작성하기</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { marginTop: 16, backgroundColor: '#555' }]} onPress={handleGoToList}>
        <Ionicons name="list-outline" size={20} color="#fff" style={{ marginRight: 6 }} />
        <Text style={styles.buttonText}>게시글 목록 보기</Text>
      </TouchableOpacity>
      <TouchableOpacity
  style={[styles.button, { marginTop: 16, backgroundColor: '#333' }]}
  onPress={() => navigation.navigate('MyCommunityScreen')}
>
  <Ionicons name="person-circle-outline" size={20} color="#fff" style={{ marginRight: 6 }} />
  <Text style={styles.buttonText}>나의 글 보기</Text>
</TouchableOpacity>

    </View>
  );
};

export default CommunityScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#1FCC79',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
