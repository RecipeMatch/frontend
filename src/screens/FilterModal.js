
// 📁 src/screens/FilterModal.js (선택 상태 유지 버전)
import React, { useState, useContext, useEffect } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { API_BASE_URL } from "@env";
import { AuthContext } from "../context/AuthContext";

const OptionButton = ({ label, selected, onPress }) => (
  <TouchableOpacity
    style={[styles.optionButton, selected && styles.optionButtonSelected]}
    onPress={onPress}
  >
    <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{label}</Text>
  </TouchableOpacity>
);

const FilterModal = ({ visible, mode, onClose, onApply }) => {
  const { user } = useContext(AuthContext);
  const userUid = user?.email;

  // 🧠 상태 유지: 모달 닫혀도 기억됨
  const [selectedSort, setSelectedSort] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);

  const handleApply = async () => {
    try {
      const requestBody = {
        userUid,
        userInfo: true // 기본 필터 항상 포함
      };

      if (mode === "sort") {
        if (!selectedSort) return Alert.alert("정렬 기준을 선택하세요.");
        const allRes = await axios.get(`${API_BASE_URL}/api/recipeAll`);
        const recipeIds = allRes.data.map((r) => r.recipeId);
        const sortRes = await axios.post(`${API_BASE_URL}/api/recipe/sort`, {
          recipeIds,
          sortBy: selectedSort,
        });
        onApply(sortRes.data);
        onClose();
        return;
      }

      if (mode === "time") {
        if (!selectedTime) return Alert.alert("요리 시간을 선택하세요.");
        let min = 0, max = 999;
        if (selectedTime === "30") [min, max] = [0, 30];
        if (selectedTime === "60") [min, max] = [30, 60];
        if (selectedTime === "90") [min, max] = [60, 90];
        if (selectedTime === "90+") [min, max] = [90, 999];
        requestBody.minTime = min;
        requestBody.maxTime = max;
      }

      if (mode === "level") {
        if (!selectedLevel) return Alert.alert("난이도를 선택하세요.");
        requestBody.difficulty = selectedLevel;
      }

      const res = await axios.post(`${API_BASE_URL}/api/recipe/search`, requestBody);
      onApply(res.data);
      onClose();
    } catch (e) {
      console.error("❌ 필터 적용 실패:", e);
      Alert.alert("에러", "필터 적용 중 문제가 발생했습니다.");
    }
  };

  const renderOptions = () => {
    if (mode === "sort") {
      return ["LIKE", "BOOKMARK"].map((type) => (
        <OptionButton
          key={type}
          label={type === "LIKE" ? "좋아요순" : "즐겨찾기순"}
          selected={selectedSort === type}
          onPress={() => setSelectedSort(type)}
        />
      ));
    }

    if (mode === "time") {
      return [
        { label: "30분 이하", value: "30" },
        { label: "30분 이상 ~ 60분 이하", value: "60" },
        { label: "60분 이상 ~ 90분 이하", value: "90" },
        { label: "90분 이상", value: "90+" },
      ].map((option) => (
        <OptionButton
          key={option.value}
          label={option.label}
          selected={selectedTime === option.value}
          onPress={() => setSelectedTime(option.value)}
        />
      ));
    }

    if (mode === "level") {
      return [
        { label: "초보", value: "EASY" },
        { label: "보통", value: "MIDDLE" },
        { label: "어려움", value: "HARD" },
      ].map((option) => (
        <OptionButton
          key={option.value}
          label={option.label}
          selected={selectedLevel === option.value}
          onPress={() => setSelectedLevel(option.value)}
        />
      ));
    }

    if (mode === "userinfo") {
      return (
        <Text style={{ fontSize: 16, color: "#666", marginVertical: 10 }}>
          내 보유 도구, 재료, 알러지 정보를 기반으로 필터링합니다.
        </Text>
      );
    }

    return null;
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>
            {{
              sort: "정렬 기준",
              time: "요리 시간",
              level: "난이도",
              userinfo: "내 정보 필터",
            }[mode]}
          </Text>
          <View style={styles.optionsContainer}>{renderOptions()}</View>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyText}>적용</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  optionsContainer: {
    marginBottom: 16,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: "#eee",
    marginVertical: 6,
  },
  optionButtonSelected: {
    backgroundColor: "#1FCC79",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  optionTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#ccc",
    borderRadius: 8,
  },
  applyButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#1FCC79",
    borderRadius: 8,
  },
  cancelText: {
    color: "#000",
  },
  applyText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default FilterModal;
