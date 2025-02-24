import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, Image } from "react-native";

const SuccessModal = ({ visible, onClose }) => {
  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Image source={{ uri: "https://cdn-icons-png.flaticon.com/512/3159/3159066.png" }} style={styles.emoji} />
          <Text style={styles.modalTitle}>🎉 업로드 성공!</Text>
          <Text style={styles.modalText}>레시피가 성공적으로 등록되었습니다.</Text>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>홈으로 돌아가기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
  },
  emoji: {
    width: 80,
    height: 80,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#555",
  },
  button: {
    backgroundColor: "#1FCC79",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default SuccessModal;
