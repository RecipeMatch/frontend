import React, { useState, useContext } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { AuthContext } from "../context/AuthContext";

const categoryOptions = [
  { label: "한식", value: "KOREAN" },
  { label: "중식", value: "CHINESE" },
  { label: "일식", value: "JAPANESE" },
  { label: "양식", value: "WESTERN" },
  { label: "동남아시아", value: "SOUTHEAST_ASIAN" },
  { label: "이탈리안", value: "ITALIAN" },
  { label: "퓨전", value: "FUSION" },
  { label: "기본", value: "DEFAULT" },
];

const FilterModal = ({ visible, mode, onClose, onApply, filterState }) => {
  const { userInfo } = useContext(AuthContext);

  const [selectedSort, setSelectedSort] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [userInfoSelected, setUserInfoSelected] = useState(filterState?.userInfo ?? false);

  const handleApply = () => {
    if (mode === "sort") {
      if (!selectedSort) return;
      onApply({ sortBy: selectedSort });
    } else if (mode === "time") {
      if (!selectedTime) return;
      let min = 0, max = 999;
      if (selectedTime === "30") [min, max] = [0, 30];
      else if (selectedTime === "60") [min, max] = [30, 60];
      else if (selectedTime === "90") [min, max] = [60, 90];
      else if (selectedTime === "90+") [min, max] = [90, 999];
      onApply({ minTime: min, maxTime: max });
    } else if (mode === "level") {
      if (!selectedLevel) return;
      onApply({ difficulty: selectedLevel });
    } else if (mode === "category") {
      if (!selectedCategory) return;
      onApply({ category: selectedCategory });
    } else if (mode === "userinfo") {
      onApply({ userInfo: userInfoSelected });
    }
    onClose();
  };

  const renderOptions = () => {
    if (mode === "sort") {
      return ["LIKE", "BOOKMARK"].map((type) => (
        <TouchableOpacity
          key={type}
          style={[styles.optionButton, selectedSort === type && styles.optionButtonSelected]}
          onPress={() => setSelectedSort(type)}
        >
          <Text style={[styles.optionText, selectedSort === type && styles.optionTextSelected]}>
            {type === "LIKE" ? "좋아요순" : "즐겨찾기순"}
          </Text>
        </TouchableOpacity>
      ));
    }

    if (mode === "time") {
      return [
        { label: "30분 이하", value: "30" },
        { label: "30~60분", value: "60" },
        { label: "60~90분", value: "90" },
        { label: "90분 이상", value: "90+" },
      ].map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[styles.optionButton, selectedTime === option.value && styles.optionButtonSelected]}
          onPress={() => setSelectedTime(option.value)}
        >
          <Text style={[styles.optionText, selectedTime === option.value && styles.optionTextSelected]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ));
    }

    if (mode === "level") {
      return [
        { label: "초보", value: "EASY" },
        { label: "보통", value: "MIDDLE" },
        { label: "어려움", value: "HARD" },
      ].map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[styles.optionButton, selectedLevel === option.value && styles.optionButtonSelected]}
          onPress={() => setSelectedLevel(option.value)}
        >
          <Text style={[styles.optionText, selectedLevel === option.value && styles.optionTextSelected]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ));
    }

    if (mode === "category") {
      return (
        <ScrollView>
          {categoryOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[styles.optionButton, selectedCategory === option.value && styles.optionButtonSelected]}
              onPress={() => setSelectedCategory(option.value)}
            >
              <Text style={[styles.optionText, selectedCategory === option.value && styles.optionTextSelected]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      );
    }

    if (mode === "userinfo") {
      return (
        <TouchableOpacity
          style={[styles.optionButton, userInfoSelected && styles.optionButtonSelected]}
          onPress={() => setUserInfoSelected(!userInfoSelected)}
        >
          <Text style={[styles.optionText, userInfoSelected && styles.optionTextSelected]}>
            🎯 사용자 정보 필터 {userInfoSelected ? "적용" : "해제"}
          </Text>
        </TouchableOpacity>
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
              category: "카테고리",
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
    maxHeight: "80%",
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
