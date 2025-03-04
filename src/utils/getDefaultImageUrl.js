import { API_BASE_URL } from "@env";

export function getDefaultImageUrl(category) {
  switch (category) {
    case "KOREAN":
      return `${API_BASE_URL}/images/korean.jpg`;
    case "WESTERN":
      return `${API_BASE_URL}/images/western.jpg`;
    case "CHINESE":
      return `${API_BASE_URL}/images/chinese.jpg`;
    case "JAPANESE":
      return `${API_BASE_URL}/images/japanese.jpg`;
    default:
      return `${API_BASE_URL}/images/default.jpg`;
  }
}