// src/utils/getDefaultImageUrl.js
export const getDefaultImageUrl = (category) => {
  switch (category) {
    case "KOREAN":
      return require("../../assets/images/Korean.png"); // ✅ 수정된 경로
    case "CHINESE":
      return require("../../assets/images/Chinese.png");
    case "JAPANESE":
      return require("../../assets/images/Japanese.png");
    case "WESTERN":
      return require("../../assets/images/Western.png");
    case "SOUTHEAST_ASIAN":
      return require("../../assets/images/SoutheastAsian.png");
    case "ITALIAN":
      return require("../../assets/images/Italian.png");
    case "FUSION":
      return require("../../assets/images/Fusion.png");
    default:
      return require("../../assets/images/Default.png");
  }
};
