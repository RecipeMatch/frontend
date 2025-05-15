import 'dotenv/config';

export default {
  expo: {
    name: "RecipeMatch",
    slug: "my-app",
    owner: "recipematch",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true
    },
    experiments: {
      typedRoutes: true,
      turboModules: false,
      unstableBridgeless: false
    },
    android: {
      googleServicesFile: "./google-services.json",
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.ak1374.recipematch"
    },
    web: {
      bundler: "webpack",
      output: "single",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ],
      "expo-font"
    ],
    extra: {
      eas: {
        projectId: "d96c73c5-b2f0-4248-b203-85aab39ee831"
      },
      androidClientId: process.env.ANDROID_CLIENT_ID,
      webClientId: process.env.WEB_CLIENT_ID
    }
  }
};
