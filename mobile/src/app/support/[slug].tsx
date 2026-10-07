import React from "react";
import { Text, View, Pressable } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { serviceFor, providerFor } from "../../domain/catalog";
import { supportProgressOptions } from "../../domain/model";
import { useVillage } from "../../state/VillageContext";
import { Screen, Button, Chip, openWebsite } from "../../ui/Elements";
import { Icon } from "../../ui/Icon";
import { c, s } from "../../ui/theme";
export default function SupportDetail() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const service = serviceFor(slug),
    provider = providerFor(slug);
  const { state, select, progress, tell } = useVillage();
  const back = () =>
    router.canGoBack() ? router.back() : router.replace("/explore");
  if (!service || !provider)
    return (
      <Screen title="Let’s find your support.">
        <Text style={s.body}>That category is not available.</Text>
        <Button
          title="Browse all support"
          onPress={() => router.replace("/explore")}
        />
      </Screen>
    );
  const selected = state.village.needs.includes(slug);
  return (
    <Screen>
      <View style={s.between}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to previous screen"
          onPress={back}
          style={[s.row, { minHeight: 44 }]}
        >
          <Icon name="back" />
          <Text style={s.label}>Back</Text>
        </Pressable>
        <Text style={s.eyebrow}>{service.shortTitle}</Text>
      </View>
      <View
        style={{
          backgroundColor: "#F2E5C2",
          width: 66,
          height: 66,
          borderRadius: 22,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name={slug} size={30} />
      </View>
      <Text role="heading" aria-level={1} style={s.h1}>
        {service.title}
      </Text>
      <Text style={[s.h3, { color: c.forest }]}>{service.tagline}</Text>
      <Text style={s.body}>{service.description}</Text>
      <Button
        title={selected ? "Saved to your village" : "Add to my village"}
        icon={selected ? "check" : "plus"}
        disabled={selected}
        onPress={() => select(slug, true)}
      />
      <View style={[s.card, { backgroundColor: "#F0EEE1" }]}>
        <Text style={s.eyebrow}>AN INDEPENDENT PLACE TO START</Text>
        <Text style={s.h2}>{provider.name}</Text>
        <Text style={s.body}>{provider.description}</Text>
        <Button
          title="Visit service website"
          icon="external"
          onPress={() => {
            void openWebsite(provider.href, tell);
          }}
        />
        <Text style={s.small}>
          Opens their website. Check coverage, availability, suitability and
          costs directly.
        </Text>
      </View>
      <Text role="heading" aria-level={2} style={s.h2}>
        A small next step
      </Text>
      <Text style={[s.body, { marginTop: -12 }]}>{provider.nextStep}</Text>
      <Button
        title="Add a step to my plan"
        secondary
        icon="plus"
        onPress={() =>
          router.push({ pathname: "/step/new", params: { category: slug } })
        }
      />
      {selected && (
        <View style={s.card}>
          <Text style={s.h3}>Where are you up to?</Text>
          <Text style={s.small}>
            Only you update this. Opening a website doesn’t mean you have made
            contact or booked.
          </Text>
          <View style={s.wrap}>
            {supportProgressOptions.map((option) => (
              <Chip
                key={option.value}
                title={option.label}
                selected={
                  (state.village.progress[slug] || "exploring") === option.value
                }
                onPress={() => progress(slug, option.value)}
              />
            ))}
          </View>
        </View>
      )}
      <View style={s.divider} />
      <Text role="heading" aria-level={2} style={s.h2}>
        Finding the right fit
      </Text>
      <Text style={s.body}>{service.details}</Text>
      {service.features.map((feature) => (
        <View key={feature} style={s.row}>
          <Icon name="check" size={17} />
          <Text style={[s.body, { flex: 1 }]}>{feature}</Text>
        </View>
      ))}
      <Text style={s.small}>
        Village is a starting point, not a booking or clinical service. These
        organisations operate independently.
      </Text>
      {selected && (
        <Pressable
          accessibilityRole="button"
          onPress={() => select(slug, false)}
          style={{
            minHeight: 48,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={s.link}>Remove from my village</Text>
        </Pressable>
      )}
    </Screen>
  );
}
