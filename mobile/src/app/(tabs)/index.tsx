import React, { useState } from "react";
import { Text, View, Pressable, TextInput, Platform } from "react-native";
import { router } from "expo-router";
import { useVillage } from "../../state/VillageContext";
import { services, serviceFor, providerFor } from "../../domain/catalog";
import { supportProgressOptions } from "../../domain/model";
import { Brand, Button, Chip, Screen, Sheet } from "../../ui/Elements";
import { VillageScene } from "../../ui/VillageScene";
import { Icon } from "../../ui/Icon";
import { c, f, s } from "../../ui/theme";
export default function Home() {
  const { state, person, removePerson, welcome } = useVillage();
  const [adding, setAdding] = useState(false),
    [label, setLabel] = useState(""),
    [category, setCategory] = useState("food"),
    [saving, setSaving] = useState(false);
  const pending = state.tasks.filter((task) => !task.done);
  const count = state.village.needs.length;
  return (
    <Screen>
      <View style={s.between}>
        <Brand />
        <View style={{ backgroundColor: c.sage, borderRadius: 20, padding: 9 }}>
          <Text style={[s.small, { color: c.forest }]}>
            {count} {count === 1 ? "light" : "lights"}
          </Text>
        </View>
      </View>
      <View style={{ gap: 8 }}>
        <Text style={s.eyebrow}>YOUR SUPPORT, TOGETHER</Text>
        <Text role="heading" aria-level={1} style={s.h1}>
          {count
            ? "A little more\nsupported."
            : "You don’t have to\ndo it all."}
        </Text>
        <Text style={s.body}>
          {count
            ? "Your village is taking shape. One small step at a time."
            : "Find a little help. Bring your people together. Make room for you."}
        </Text>
      </View>
      <VillageScene />
      {!state.welcomed && (
        <View style={[s.card, { backgroundColor: "#F0EAD9" }]}>
          <Text style={s.h3}>Start with one thing.</Text>
          <Text style={s.body}>
            {Platform.OS === "web"
              ? "Try saving support and making a plan. This browser preview resets when you reload; the phone app keeps your village on the device."
              : "Save the support that feels right. Your village stays on this device, with no sign-up needed."}
          </Text>
          <Button
            title="Find my first bit of support"
            onPress={() => {
              welcome();
              router.push("/explore");
            }}
            icon="arrow"
          />
          <Pressable
            onPress={welcome}
            accessibilityRole="button"
            style={{
              minHeight: 44,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={s.link}>I’ll explore at my own pace</Text>
          </Pressable>
        </View>
      )}
      {pending.length > 0 && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Open next step: ${pending[0].title}`}
          onPress={() => router.push("/plan")}
          style={[s.card, { backgroundColor: c.sage }]}
        >
          <View style={s.between}>
            <Text style={s.eyebrow}>YOUR NEXT LITTLE STEP</Text>
            <Icon name="arrow" />
          </View>
          <Text style={s.h3}>{pending[0].title}</Text>
          <Text style={s.small}>
            {pending.length} {pending.length === 1 ? "step" : "steps"} in your
            plan. At your pace.
          </Text>
        </Pressable>
      )}
      <View style={s.between}>
        <Text role="heading" aria-level={2} style={s.h2}>
          Saved support
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/explore")}
          style={{ minHeight: 44, justifyContent: "center" }}
        >
          <Text style={s.link}>Explore more</Text>
        </Pressable>
      </View>
      {count === 0 ? (
        <Text style={[s.body, { marginTop: -12 }]}>
          Your saved services will feel at home here. Explore a circle above, or
          browse all support.
        </Text>
      ) : (
        state.village.needs.map((slug) => {
          const service = serviceFor(slug)!;
          const progress = supportProgressOptions.find(
            (p) => p.value === (state.village.progress[slug] || "exploring"),
          );
          return (
            <Pressable
              key={slug}
              accessibilityRole="button"
              accessibilityLabel={`Open ${service.title}`}
              onPress={() => router.push(`/support/${slug}`)}
              style={[s.card, s.row]}
            >
              <View
                style={{
                  backgroundColor: "#F6EBCB",
                  padding: 12,
                  borderRadius: 18,
                }}
              >
                <Icon name={slug} />
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={s.h3}>{service.shortTitle}</Text>
                <Text style={s.small}>{providerFor(slug)?.name}</Text>
                <Text
                  style={{
                    fontFamily: f.medium,
                    fontSize: 11,
                    color: c.forest,
                  }}
                >
                  {progress?.label}
                </Text>
              </View>
              <Icon name="arrow" size={18} />
            </Pressable>
          );
        })
      )}
      <View style={s.divider} />
      <View style={{ gap: 7 }}>
        <Text role="heading" aria-level={2} style={s.h2}>
          Already in your corner
        </Text>
        <Text style={s.body}>
          A friend who cooks. Your regular cleaner. The people and support you
          already lean on.
        </Text>
      </View>
      {state.people.map((p) => (
        <View key={p.id} style={[s.card, s.row]}>
          <Icon name={p.category} />
          <View style={{ flex: 1 }}>
            <Text style={s.label}>{p.label}</Text>
            <Text style={s.small}>{serviceFor(p.category)?.shortTitle}</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Remove ${p.label}`}
            onPress={() => removePerson(p.id)}
            style={{
              minHeight: 44,
              minWidth: 44,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="close" size={16} />
          </Pressable>
        </View>
      ))}
      <Button
        title="Add existing support"
        secondary
        icon="plus"
        onPress={() => setAdding(true)}
      />
      <Sheet
        open={adding}
        title="Who’s in your corner?"
        onClose={() => setAdding(false)}
      >
        <Text style={s.body}>
          Use a simple label, like “A friend who cooks”. Keep phone numbers,
          addresses and health details out of it.
        </Text>
        <Text style={s.label}>Support label</Text>
        <TextInput
          accessibilityLabel="Support label"
          placeholder="A friend who cooks"
          placeholderTextColor={c.muted}
          style={s.input}
          value={label}
          maxLength={48}
          onChangeText={setLabel}
        />
        <Text style={s.label}>What do they help with?</Text>
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
        <Button
          title={saving ? "Saving…" : "Add to my village"}
          disabled={!label.trim() || saving}
          onPress={() => {
            setSaving(true);
            void person(label, category).then((ok) => {
              setSaving(false);
              if (ok) {
                setAdding(false);
                setLabel("");
              }
            });
          }}
        />
      </Sheet>
    </Screen>
  );
}
