import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { createPersistence } from "../domain/persistence";

const memory = new Map<string, string>();
const options = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};
export const persistence = createPersistence(
  Platform.OS === "web"
    ? {
        get: async (key) => memory.get(key) ?? null,
        set: async (key, value) => {
          memory.set(key, value);
        },
        remove: async (key) => {
          memory.delete(key);
        },
      }
    : {
        get: (key) => SecureStore.getItemAsync(key, options),
        set: (key, value) => SecureStore.setItemAsync(key, value, options),
        remove: (key) => SecureStore.deleteItemAsync(key, options),
      },
);
