import 'dotenv/config';

export default () => ({
  expo: {
    entryPoint: "./myApp/app/index.js",
    name: "myApp",
    slug: "myApp",
    owner: "bxnjiho",
    version: "1.0.0",
    sdkVersion: "52.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.anonymous.myApp",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.anonymous.myApp"
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
      head: [
        {
          tag: "script",
          attrs: {
            src: `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&libraries=places`,
            async: true,
            defer: true
          }
        }
      ]
    },
    extra: {
      apiKey: process.env.GOOGLE_MAPS_API_KEY,
      eas: {
        projectId: "2cae16b8-394d-4bd2-aad3-030ba714ddff"
      }
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ],
      [
        "@rnmapbox/maps",
        {
          "RNMapboxMapsDownloadToken": "sk.eyJ1IjoiN2FuaW5lIiwiYSI6ImNtN3F3ZWhoZjBjOGIya3NlZjc5aWc2NmoifQ.7bRiuJDphvZiBmpK26lkQw"
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    }
  }
});
