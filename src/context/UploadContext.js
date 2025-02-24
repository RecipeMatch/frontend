import React, { createContext, useState } from "react";

export const UploadContext = createContext();

export const UploadProvider = ({ children }) => {
  const [foodName, setFoodName] = useState("");
  const [description, setDescription] = useState("");
  const [cookingDuration, setCookingDuration] = useState(30);
  const [ingredients, setIngredients] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [steps, setSteps] = useState([]);
  const [category, setCategory] = useState("한식"); // ✅ 카테고리 상태 추가

  return (
    <UploadContext.Provider
      value={{
        foodName,
        setFoodName,
        description,
        setDescription,
        cookingDuration,
        setCookingDuration,
        ingredients,
        setIngredients,
        equipment,
        setEquipment,
        steps,
        setSteps,
        category,        // ✅ 추가
        setCategory,     // ✅ 추가
      }}
    >
      {children}
    </UploadContext.Provider>
  );
};
