import React from "react";
import { Text } from "react-native";
import { router } from "expo-router";
import { Screen, Button } from "../ui/Elements";
import { s } from "../ui/theme";
export default function Missing() {
  return (
    <Screen title="Let’s head home.">
      <Text style={s.body}>That part of your village could not be found.</Text>
      <Button title="Back to my village" onPress={() => router.replace("/")} />
    </Screen>
  );
}
