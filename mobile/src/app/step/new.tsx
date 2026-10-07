import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useVillage } from "../../state/VillageContext";
import { services, slugs, providerFor } from "../../domain/catalog";
import { Button, Chip, Screen } from "../../ui/Elements";
import { c, s } from "../../ui/theme";
export default function NewStep() {
  const params = useLocalSearchParams<{ category?: string }>();
  const initial =
    params.category && slugs.includes(params.category)
      ? params.category
      : "food";
  const [category, setCategory] = useState(initial);
  const [title, setTitle] = useState(
    params.category ? `Explore ${providerFor(initial)?.name || "support"}` : "",
  );
  const [saving, setSaving] = useState(false);
  const { task } = useVillage();
  return (
    <Screen
      eyebrow="YOUR NEXT STEP"
      title="One small thing."
      subtitle="Make a little room for something that helps."
    >
      <Text style={s.label}>What would you like to do?</Text>
      <TextInput
        accessibilityLabel="Next step"
        value={title}
        onChangeText={setTitle}
        maxLength={96}
        placeholder="Ask about meal delivery"
        placeholderTextColor={c.muted}
        style={s.input}
      />
      <Text style={s.label}>Related support</Text>
      <View style={s.wrap}>
        {services.map((service) => (
          <Chip
            key={service.slug}
            title={service.shortTitle}
            selected={category === service.slug}
            onPress={() => setCategory(service.slug)}
          />
        ))}
      </View>
      <Text style={s.small}>
        Use a short, practical label. Leave contact details and health
        information out of your plan.
      </Text>
      <Button
        title={saving ? "Saving…" : "Add to my plan"}
        disabled={saving || !title.trim()}
        onPress={() => {
          setSaving(true);
          void task(title, category).then((ok) => {
            setSaving(false);
            if (ok) router.replace("/plan");
          });
        }}
      />
      <Button
        title="Cancel"
        secondary
        onPress={() =>
          router.canGoBack() ? router.back() : router.replace("/plan")
        }
      />
    </Screen>
  );
}
