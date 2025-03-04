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

  const [image, setImage] = useState(null);

  const resetUpload = () => {
    setFoodName("");
    setDescription("");
    setCookingDuration(30);
    setIngredients([]);
    setEquipment([]);
    setSteps([]);
    setCategory("한식");
    setImage(null);
  };

  return (
    <UploadContext.Provider
      value={{
        foodName, setFoodName,
        description, setDescription,
        cookingDuration, setCookingDuration,
        ingredients, setIngredients,
        equipment, setEquipment,
        steps, setSteps,
        category, setCategory,
        image, setImage,
        resetUpload,
      }}
    >
      {children}
    </UploadContext.Provider>
  );
  
};