// 📁 components/FilterSortBar.js
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const FilterSortBar = ({ selectedSort, onSortChange, selectedTime, onTimeChange }) => {
  return (
    <View style={styles.barContainer}>
      <View style={styles.sortRow}>
        <TouchableOpacity
          style={[styles.sortButton, selectedSort === "LIKE" && styles.active]}
          onPress={() => onSortChange("LIKE")}
        >
          <Ionicons name="heart" size={14} color={selectedSort === "LIKE" ? "white" : "red"} />
          <Text style={[styles.sortText, selectedSort === "LIKE" && styles.activeText]}> 좋아요순</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.sortButton, selectedSort === "BOOKMARK" && styles.active]}
          onPress={() => onSortChange("BOOKMARK")}
        >
          <Ionicons name="star" size={14} color={selectedSort === "BOOKMARK" ? "white" : "green"} />
          <Text style={[styles.sortText, selectedSort === "BOOKMARK" && styles.activeText]}> 즐겨찾기순</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterRow}>
        {[
          { label: "30분 이하", min: 0, max: 30 },
          { label: "30~60분", min: 30, max: 60 },
          { label: "60~90분", min: 60, max: 90 },
          { label: "90분 이상", min: 90, max: 1000 },
        ].map((time, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.timeButton, selectedTime?.min === time.min && styles.active]}
            onPress={() => onTimeChange(time)}
          >
            <Text
              style={[styles.sortText, selectedTime?.min === time.min && styles.activeText]}
            >
              {time.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  barContainer: {
    backgroundColor: "#fff",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  sortRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
  },
  timeButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    marginRight: 6,
    marginBottom: 6,
  },
  sortText: {
    fontSize: 14,
    color: "#333",
  },
  active: {
    backgroundColor: "#1FCC79",
  },
  activeText: {
    color: "#fff",
  },
});

export default FilterSortBar;
