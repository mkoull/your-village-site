import React from "react";
import {
  Pressable,
  Text,
  View,
  ScrollView,
  StyleSheet,
  Platform,
  Modal,
  KeyboardAvoidingView,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { c, f, s } from "./theme";
import { Icon, Mark } from "./Icon";
import { useVillage } from "../state/VillageContext";
export function Button({
  title,
  onPress,
  secondary = false,
  icon,
  disabled = false,
  label,
}: {
  title: string;
  onPress: () => void;
  secondary?: boolean;
  icon?: string;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label || title}
      accessibilityState={{ disabled }}
      aria-disabled={disabled}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        secondary && styles.secondary,
        { opacity: disabled ? 0.45 : pressed ? 0.75 : 1 },
      ]}
    >
      <Text style={[styles.buttonText, secondary && { color: c.forest }]}>
        {title}
      </Text>
      {icon && (
        <Icon name={icon} size={18} color={secondary ? c.forest : c.cream} />
      )}
    </Pressable>
  );
}
export function Chip({
  title,
  selected = false,
  onPress,
  label,
}: {
  title: string;
  selected?: boolean;
  onPress: () => void;
  label?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label || title}
      accessibilityState={{ selected }}
      aria-pressed={selected}
      style={({ pressed }) => [
        styles.chip,
        selected && { backgroundColor: c.forest, borderColor: c.forest },
        pressed && { opacity: 0.75 },
      ]}
    >
      <Text
        style={[
          s.label,
          { color: selected ? c.cream : c.forest, fontSize: 11 },
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}
export function Screen({
  children,
  title,
  eyebrow,
  subtitle,
}: {
  children: React.ReactNode;
  title?: string;
  eyebrow?: string;
  subtitle?: string;
}) {
  return (
    <SafeAreaView edges={["top"]} style={s.page}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={s.content}
      >
        {eyebrow && <Text style={s.eyebrow}>{eyebrow}</Text>}
        {title && (
          <Text role="heading" aria-level={1} style={s.h1}>
            {title}
          </Text>
        )}
        {subtitle && (
          <Text style={[s.body, { marginTop: -10 }]}>{subtitle}</Text>
        )}
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
export function Brand() {
  return (
    <View style={s.row}>
      <Mark />
      <Text style={{ fontFamily: f.heading, fontSize: 25, color: c.forest }}>
        your village
      </Text>
    </View>
  );
}
export function Sheet({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <Modal
      visible={open}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.scrim}
      >
        <SafeAreaView
          edges={["bottom", "top"]}
          style={styles.sheet}
          accessibilityViewIsModal
        >
          <View style={[s.between, { paddingHorizontal: 22, paddingTop: 18 }]}>
            <Text role="heading" aria-level={2} style={[s.h2, { flex: 1 }]}>
              {title}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close panel"
              onPress={onClose}
              style={styles.close}
            >
              <Icon name="close" />
            </Pressable>
          </View>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ padding: 22, gap: 18 }}
          >
            {children}
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
export function Notices() {
  const { notice, dismiss, saveError, retry } = useVillage();
  if (!notice && !saveError) return null;
  return (
    <SafeAreaView edges={["bottom"]} style={{ backgroundColor: c.deep }}>
      <View style={styles.notice} accessibilityLiveRegion="polite">
        <Text style={[s.small, { color: c.cream, flex: 1 }]}>
          {notice?.text ||
            "Your latest changes have not been saved on this device."}
        </Text>
        {notice?.undo && (
          <Pressable
            accessibilityRole="button"
            onPress={notice.undo}
            style={styles.close}
          >
            <Text style={{ color: c.gold, fontFamily: f.bold }}>Undo</Text>
          </Pressable>
        )}
        {saveError && (
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              void retry();
            }}
            style={styles.close}
          >
            <Text style={{ color: c.gold, fontFamily: f.bold }}>Retry</Text>
          </Pressable>
        )}
        <Pressable
          onPress={dismiss}
          accessibilityRole="button"
          accessibilityLabel="Dismiss message"
          style={styles.close}
        >
          <Icon name="close" color={c.cream} size={16} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
export async function openWebsite(
  url: string,
  tell: (message: string) => void,
) {
  try {
    if (!url.startsWith("https://")) throw new Error();
    await Linking.openURL(url);
  } catch {
    tell(
      "The website could not be opened. Check your connection and try again.",
    );
  }
}
const styles = StyleSheet.create({
  button: {
    minHeight: 50,
    borderRadius: 28,
    backgroundColor: c.forest,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  secondary: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: c.line,
  },
  buttonText: {
    fontFamily: f.bold,
    color: c.cream,
    fontSize: 13,
    flexShrink: 1,
    textAlign: "center",
  },
  chip: {
    minHeight: 44,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 23,
    borderColor: c.line,
    borderWidth: 1,
    backgroundColor: c.cream,
    alignItems: "center",
    justifyContent: "center",
  },
  scrim: {
    flex: 1,
    backgroundColor: "#142C2788",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  sheet: {
    width: "100%",
    maxWidth: 620,
    maxHeight: "92%",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: c.paper,
  },
  close: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  notice: {
    backgroundColor: c.deep,
    paddingLeft: 18,
    paddingRight: 4,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});
