import React from "react";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { c, f } from "../../ui/theme";
import { Icon, Mark } from "../../ui/Icon";
export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.forest,
        tabBarInactiveTintColor: c.muted,
        tabBarStyle: {
          backgroundColor: c.cream,
          borderTopColor: c.line,
          paddingTop: 8,
          paddingBottom: insets.bottom + 6,
          height: 68 + insets.bottom,
        },
        tabBarLabelStyle: {
          fontFamily: f.medium,
          fontSize: 10,
          paddingBottom: 0,
        },
        sceneStyle: { backgroundColor: c.paper },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "My village", tabBarIcon: () => <Mark size={25} /> }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <Icon name="search" color={String(color)} />
          ),
        }}
      />
      <Tabs.Screen
        name="plan"
        options={{
          title: "My plan",
          tabBarIcon: ({ color }) => <Icon name="plan" color={String(color)} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <Icon name="settings" color={String(color)} />
          ),
        }}
      />
    </Tabs>
  );
}
