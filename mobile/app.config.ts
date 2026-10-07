import type { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "Your Village",
  slug: "your-village",
  version: "0.1.0",
  scheme: "yourvillage",
  orientation: "portrait",
  userInterfaceStyle: "light",
  icon: "./assets/village-icon.png",
  ios: {
    supportsTablet: true,
    ...(process.env.VILLAGE_IOS_BUNDLE_ID
      ? { bundleIdentifier: process.env.VILLAGE_IOS_BUNDLE_ID }
      : {}),
    config: { usesNonExemptEncryption: false },
  },
  android: {
    ...(process.env.VILLAGE_ANDROID_PACKAGE
      ? { package: process.env.VILLAGE_ANDROID_PACKAGE }
      : {}),
    adaptiveIcon: {
      foregroundImage: "./assets/village-adaptive.png",
      backgroundColor: "#F8F6EF",
    },
    blockedPermissions: [
      "android.permission.RECORD_AUDIO",
      "android.permission.READ_CONTACTS",
      "android.permission.ACCESS_FINE_LOCATION",
      "android.permission.ACCESS_COARSE_LOCATION",
    ],
  },
  plugins: [
    "expo-router",
    "expo-font",
    ["expo-secure-store", { configureAndroidBackup: true }],
    ["expo-notifications", { color: "#385247" }],
  ],
  web: {
    bundler: "metro",
    output: "single",
    favicon: "./assets/village-icon.png",
    name: "Your Village preview",
  },
  extra: {
    ...(process.env.VILLAGE_EAS_PROJECT_ID
      ? { eas: { projectId: process.env.VILLAGE_EAS_PROJECT_ID } }
      : {}),
  },
};
export default config;
