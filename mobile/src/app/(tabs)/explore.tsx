import React, { useState } from "react";
import { Text, TextInput, View, Pressable } from "react-native";
import { router } from "expo-router";
import { services, providerFor } from "../../domain/catalog";
import { useVillage } from "../../state/VillageContext";
import { Button, Chip, Screen } from "../../ui/Elements";
import { Icon } from "../../ui/Icon";
import { c, s } from "../../ui/theme";
export default function Explore() {
  const { state, select } = useVillage();
  const [query, setQuery] = useState(""),
    [filter, setFilter] = useState("all");
  const found = services.filter(
    (service) =>
      (filter === "all" || service.category === filter) &&
      `${service.title} ${service.need} ${providerFor(service.slug)?.name}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  return (
    <Screen
      eyebrow="FIND YOUR KIND OF SUPPORT"
      title={"What would\nhelp today?"}
      subtitle="Good help is already out there. Let’s find a place to start."
    >
      <View style={[s.row, s.input]}>
        <Icon name="search" />
        <TextInput
          accessibilityLabel="Search support"
          placeholder="Meals, a nanny, someone to talk to…"
          placeholderTextColor={c.muted}
          value={query}
          onChangeText={setQuery}
          style={{ flex: 1, color: c.ink, minHeight: 30 }}
          returnKeyType="search"
        />
      </View>
      <View style={s.wrap}>
        {[
          ["all", "All support"],
          ["practical", "Practical help"],
          ["specialist", "Specialists"],
          ["emotional", "Wellbeing"],
          ["community", "Connection"],
        ].map(([key, label]) => (
          <Chip
            key={key}
            title={label}
            selected={filter === key}
            onPress={() => setFilter(key)}
          />
        ))}
      </View>
      <Text style={s.small}>
        {found.length} {found.length === 1 ? "kind" : "kinds"} of support ·
        independent services
      </Text>
      {found.map((service) => {
        const saved = state.village.needs.includes(service.slug),
          provider = providerFor(service.slug);
        return (
          <View key={service.slug} style={s.card}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Explore ${service.title}`}
              onPress={() => router.push(`/support/${service.slug}`)}
              style={{ gap: 12 }}
            >
              <View style={s.between}>
                <View
                  style={{
                    backgroundColor: saved ? "#F6E5BA" : c.sage,
                    borderRadius: 17,
                    padding: 12,
                  }}
                >
                  <Icon name={service.slug} />
                </View>
                <Icon name="arrow" size={19} />
              </View>
              <Text style={s.h2}>{service.title}</Text>
              <Text style={s.body}>{service.tagline}</Text>
              <Text style={s.small}>A place to start · {provider?.name}</Text>
            </Pressable>
            <Button
              title={saved ? "Saved · view my village" : "Add to my village"}
              icon={saved ? "check" : "plus"}
              secondary={!saved}
              label={
                saved
                  ? `View ${service.title} in my village`
                  : `Save ${service.title}`
              }
              onPress={() =>
                saved ? router.push("/") : select(service.slug, true)
              }
            />
          </View>
        );
      })}
      {found.length === 0 && (
        <View style={s.card}>
          <Text style={s.h2}>Let’s try a wider circle.</Text>
          <Text style={s.body}>
            Try a kind of support, such as meals, sleep or cleaning.
          </Text>
          <Button
            secondary
            title="Show all support"
            onPress={() => {
              setQuery("");
              setFilter("all");
            }}
          />
        </View>
      )}
      <Text style={s.small}>
        These services are independent of Village. Check their coverage,
        suitability, availability and costs directly.
      </Text>
    </Screen>
  );
}
