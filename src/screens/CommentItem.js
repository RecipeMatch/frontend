import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Alert } from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '@env';

const CommentItem = ({ comment, currentUserUid, onRefresh }) => {
    console.log('댓글 수정/삭제 ID:', comment.commentId); // 여기는 commentId로
    console.log('comment 전체:', comment);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const isMyComment = comment.uid === currentUserUid;


  // 댓글 수정 API
  const handleUpdate = async () => {
    console.log('🛠️ 수정 요청보냄');
    console.log('댓글 ID:', comment.commentId); // 또는 comment.id
    console.log('수정할 내용:', editedContent);
  
    try {
        await axios.put(`${API_BASE_URL}/api/post/comment/${comment.commentId}`, {
            content: editedContent,
          });
          
        console.log('✅ 댓글 수정 성공');
          
      setEditModalVisible(false);
      onRefresh();
    } catch (error) {
      console.error('❌ 댓글 수정 실패:', error);
      Alert.alert('수정 실패', '댓글 수정에 실패했습니다.');
    }
  };
  

  // 댓글 삭제 API
  const handleDelete = async () => {
    Alert.alert('삭제 확인', '정말 삭제하시겠습니까?', [
      { text: '취소' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`${API_BASE_URL}/api/post/comment/${comment.commentId}`);


            onRefresh();
          } catch (error) {
            console.error('댓글 삭제 실패:', error);
            Alert.alert('삭제 실패', '댓글 삭제에 실패했습니다.');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.commentContainer}>
      <View style={styles.row}>
      <Text style={styles.nickname}>
  {comment.uid || '익명'}
</Text>

        <Text style={styles.content}>{comment.content}</Text>
      </View>

      {isMyComment && (
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => setEditModalVisible(true)}>
            <Text style={styles.actionText}>수정</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete}>
            <Text style={styles.actionText}>삭제</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 수정 모달 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>댓글 수정</Text>
            <TextInput
              style={styles.input}
              value={editedContent}
              onChangeText={setEditedContent}
              multiline
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Text style={styles.cancelButton}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleUpdate}>
                <Text style={styles.saveButton}>저장</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CommentItem;

const styles = StyleSheet.create({
  commentContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  row: {
    flexDirection: 'column',
  },
  nickname: {
    fontWeight: 'bold',
  },
  content: {
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 8,
  },
  actionText: {
    marginRight: 16,
    color: '#007AFF',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContainer: {
    marginHorizontal: 20,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  input: {
    height: 80,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    marginRight: 20,
    color: '#888',
  },
  saveButton: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
});
