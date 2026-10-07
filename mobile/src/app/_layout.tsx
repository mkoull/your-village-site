import React, { useEffect, useState } from "react";
import { View, Text, Platform, ActivityIndicator } from "react-native";
import { Stack, router } from "expo-router";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { VillageProvider, useVillage } from "../state/VillageContext";
import { Notices, Button, Sheet } from "../ui/Elements";
import { c, s } from "../ui/theme";
export { ErrorBoundary } from "expo-router";
function AppFrame() {
  const { ready, loadError, retry, clear, busy, notice } = useVillage();
  const [reset, setReset] = useState(false);
  useEffect(() => {
    if (!ready || Platform.OS === "web") return;
    let cleanup: (() => void) | undefined;
    let active = true;
    void import("expo-notifications")
      .then(async (N) => {
        if (!active) return;
        N.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowBanner: true,
            shouldShowList: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
          }),
        });
        const open = () => router.push("/plan");
        const listener = N.addNotificationResponseReceivedListener(open);
        cleanup = () => listener.remove();
        const response = await N.getLastNotificationResponseAsync();
        if (active && response) {
          open();
          await N.clearLastNotificationResponseAsync();
        }
      })
      .catch(() => {});
    return () => {
      active = false;
      cleanup?.();
    };
  }, [ready]);
  if (!ready)
    return (
      <View
        style={[s.page, { justifyContent: "center", padding: 30, gap: 20 }]}
      >
        {loadError ? (
          <>
            <Text style={s.h2}>Let’s bring your village back.</Text>
            <Text style={s.body}>
              Your saved copy couldn’t be opened. Unlock your phone and try
              again. It has not been overwritten.
            </Text>
            <Button
              title="Try again"
              onPress={() => {
                void retry();
              }}
            />
            <Button
              title="Start fresh instead"
              secondary
              onPress={() => setReset(true)}
            />
            <Sheet
              open={reset}
              title="Remove the saved copy?"
              onClose={() => setReset(false)}
            >
              <Text style={s.body}>
                This permanently removes your saved village and its reminders
                from this device. Try opening it again first if you want to keep
                it.
              </Text>
              {notice && (
                <Text accessibilityLiveRegion="polite" style={s.small}>
                  {notice.text}
                </Text>
              )}
              <Button
                title="Remove saved copy"
                disabled={busy}
                onPress={() => {
                  void clear();
                }}
              />
              <Button
                title="Keep it and try again"
                secondary
                onPress={() => setReset(false)}
              />
            </Sheet>
          </>
        ) : (
          <ActivityIndicator color={c.forest} />
        )}
      </View>
    );
  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: c.paper },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="support/[slug]"
          options={{ presentation: "modal" }}
        />
      </Stack>
      <Notices />
    </View>
  );
}
export default function RootLayout() {
  const [fonts, error] = useFonts({
    Newsreader: require("@expo-google-fonts/newsreader/400Regular/Newsreader_400Regular.ttf"),
    NewsreaderItalic: require("@expo-google-fonts/newsreader/400Regular_Italic/Newsreader_400Regular_Italic.ttf"),
    Jakarta: require("@expo-google-fonts/plus-jakarta-sans/400Regular/PlusJakartaSans_400Regular.ttf"),
    JakartaMedium: require("@expo-google-fonts/plus-jakarta-sans/500Medium/PlusJakartaSans_500Medium.ttf"),
    JakartaSemiBold: require("@expo-google-fonts/plus-jakarta-sans/600SemiBold/PlusJakartaSans_600SemiBold.ttf"),
  });
  if (!fonts && !error)
    return (
      <View
        style={{ flex: 1, backgroundColor: c.paper, justifyContent: "center" }}
      >
        <ActivityIndicator color={c.forest} />
      </View>
    );
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <VillageProvider>
        <AppFrame />
      </VillageProvider>
    </SafeAreaProvider>
  );
}
