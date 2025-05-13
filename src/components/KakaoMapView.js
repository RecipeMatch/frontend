import React from "react";
import { Dimensions } from "react-native";
import { WebView } from "react-native-webview";
import { KAKAO_JS_KEY } from "@env";

const KakaoMapView = ({ location, stores }) => {
  console.log("🟢 KakaoMapView 렌더됨");
  console.log("📌 Kakao JS Key:", KAKAO_JS_KEY);
  console.log("📍 Location:", location);
  console.log("🏬 Stores:", stores);

  const lat = location?.latitude || 37.5665;
  const lon = location?.longitude || 126.9780;

  const htmlContent = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <style>
        html, body, #map {
          height: 100%; margin: 0; padding: 0;
        }
      </style>
      <script>
        window.onerror = function(message, source, lineno, colno, error) {
          document.body.innerHTML = '<h3 style="color:red">📛 JS Error: ' + message + '</h3>';
        };
      </script>
      <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_KEY}&autoload=false"></script>
      <script>
        kakao.maps.load(function () {
          var container = document.getElementById('map');
          var options = {
            center: new kakao.maps.LatLng(${lat}, ${lon}),
            level: 3
          };
          var map = new kakao.maps.Map(container, options);

          // 내 위치 마커
          new kakao.maps.Marker({
            position: new kakao.maps.LatLng(${lat}, ${lon}),
            map: map,
            title: "내 위치"
          });

          // 상점 마커 추가
          var stores = ${JSON.stringify(stores)};
          stores.forEach(function(store) {
            new kakao.maps.Marker({
              map: map,
              position: new kakao.maps.LatLng(store.y, store.x),
              title: store.place_name
            });
          });
        });
      </script>
    </head>
    <body>
      <div id="map"></div>
    </body>
  </html>
  `;

  return (
    <WebView
      originWhitelist={["*"]}
      source={{ html: htmlContent }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      style={{ height: 300, width: Dimensions.get("window").width - 40, borderRadius: 10 }}
    />
  );
};

export default KakaoMapView;
