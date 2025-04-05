// 📁 src/screens/FilterModal.js
import React, { useState, useContext } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import axios from "axios";
import { API_BASE_URL } from "@env";
import { AuthContext } from "../context/AuthContext";

const OptionButton = ({ label, selected, onPress }) => (
    console.log("안녕녕"),
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
  const [selectedSort, setSelectedSort] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const handleApply = async () => {
    console.log("🔥 handleApply 호출됨");
    try {
      if (mode === "sort") {
        console.log("📤 정렬 실행중 - 선택된 값:", selectedSort);
        if (!selectedSort) {
          console.warn("⚠️ 정렬 기준이 선택되지 않았습니다.");
          return;
        }
  
        const allRes = await axios.get(`${API_BASE_URL}/api/recipeAll`);
        const recipeIds = allRes.data.map((r) => r.recipeId); // ❗ 확인 필요: r.id일 수도
        console.log("📦 보내는 recipeIds:", recipeIds);
  
        const sortRes = await axios.post(`${API_BASE_URL}/api/recipe/sort`, {
          recipeIds,
          sortBy: selectedSort,
        });
  
        console.log("✅ 정렬 결과:", sortRes.data);
        onApply(sortRes.data);
      }
  
      else if (mode === "time") {
        console.log("⏱ 요리시간 필터 실행중 - 선택된 값:", selectedTime);
        if (!selectedTime) {
          console.warn("⚠️ 요리시간이 선택되지 않았습니다.");
          return;
        }
  
        let min = 0, max = 999;
        if (selectedTime === "30") [min, max] = [0, 30];
        if (selectedTime === "60") [min, max] = [30, 60];
        if (selectedTime === "90") [min, max] = [60, 90];
        if (selectedTime === "999") [min, max] = [90, 999];
  
        const res = await axios.post(`${API_BASE_URL}/api/recipe/search`, {
          userUid,
          minTime: min,
          maxTime: max,
          userInfo: true,
        });
  
        console.log("✅ 요리시간 결과:", res.data);
        onApply(res.data);
      }
    } catch (e) {
      console.error("❌ 필터/정렬 실패:", e);
    }
  };
  

  const renderOptions = () => {
    if (mode === "sort") {
      return ["LIKE", "BOOKMARK"].map((type) => (
        <OptionButton
          key={type}
          label={type === "LIKE" ? "좋아요순" : "즐겨찾기순"}
          selected={selectedSort === type}
          onPress={() => {
            console.log("✅ 정렬 선택됨:", type);
            setSelectedSort(type);
          }}
        />
      ));
    } else if (mode === "time") {
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
          onPress={() => {
            console.log("✅ 요리시간 선택됨:", option.value);
            setSelectedTime(option.value);
          }}
        />
      ));
    }
    return null;
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{mode === "sort" ? "정렬 기준" : "요리 시간"}</Text>
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
