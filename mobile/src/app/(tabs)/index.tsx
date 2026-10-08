import React, { useState } from "react";
import { Text, View, Pressable, TextInput, Platform } from "react-native";
import { router } from "expo-router";
import { useVillage } from "../../state/VillageContext";
import { services, serviceFor, providerFor } from "../../domain/catalog";
import { supportProgressOptions } from "../../domain/model";
import { Brand, Button, Chip, Screen, Sheet } from "../../ui/Elements";
import { VillageScene } from "../../ui/VillageScene";
import { NextStepCard } from "../../ui/NextStepCard";
import { Icon } from "../../ui/Icon";
import { c, f, s } from "../../ui/theme";
export default function Home() {
  const { state, person, changePerson, removePerson, welcome } = useVillage();
  const [adding, setAdding] = useState(false),
    [label, setLabel] = useState(""),
    [category, setCategory] = useState("food"),
    [saving, setSaving] = useState(false),
    [editing, setEditing] = useState<string | null>(null),
    [formError, setFormError] = useState("");
  const count = state.village.needs.length;
  const hasVillage =
    count > 0 || state.people.length > 0 || state.tasks.length > 0;
  const closeEditor = () => {
    if (!saving) setAdding(false);
  };
  return (
    <Screen>
      <View style={s.between}>
        <Brand />
        <View style={{ backgroundColor: c.sage, borderRadius: 20, padding: 9 }}>
          <Text style={[s.small, { color: c.forest }]}>
            {count ? `${count} saved` : "Your space"}
          </Text>
        </View>
      </View>
      <View style={{ gap: 8 }}>
        <Text style={s.eyebrow}>YOUR SUPPORT, TOGETHER</Text>
        <Text role="heading" aria-level={1} style={s.h1}>
          {hasVillage
            ? "A little more\nsupported."
            : "You don’t have to\ndo it all."}
        </Text>
        <Text style={s.body}>
          {hasVillage
            ? "Your village is taking shape. One small step at a time."
            : "Find a little help. Bring your people together. Make room for you."}
        </Text>
      </View>
      {!hasVillage ? (
        <View style={{ gap: 12 }}>
          <Button
            title="Find my first bit of support"
            onPress={() => {
              welcome();
              router.push("/explore");
            }}
            icon="arrow"
          />
          <Text style={[s.small, { textAlign: "center" }]}>
            No sign-up. Start with whatever feels useful.
          </Text>
        </View>
      ) : (
        <NextStepCard />
      )}
      <VillageScene />
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
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Edit ${p.label}`}
            onPress={() => {
              setEditing(p.id);
              setLabel(p.label);
              setCategory(p.category);
              setFormError("");
              setAdding(true);
            }}
            style={{ flex: 1, minHeight: 48, justifyContent: "center", gap: 4 }}
          >
            <Text style={s.label}>{p.label}</Text>
            <Text style={s.small}>
              {serviceFor(p.category)?.shortTitle} · Edit
            </Text>
          </Pressable>
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
        disabled={state.people.length >= 12}
        onPress={() => {
          setEditing(null);
          setLabel("");
          setCategory("food");
          setFormError("");
          setAdding(true);
        }}
      />
      {state.people.length >= 12 && (
        <Text style={s.small}>
          You’ve added 12 existing supports. Edit one above, or remove one to
          make room.
        </Text>
      )}
      <Text style={s.small}>
        {Platform.OS === "web"
          ? "You’re exploring the browser preview. Your village resets on reload; the phone app saves on your device."
          : "Your village is private to this device. No account or cloud sync is needed."}
      </Text>
      <Sheet
        open={adding}
        title={editing ? "A little change of plan?" : "Who’s in your corner?"}
        onClose={closeEditor}
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
        {!!formError && (
          <Text
            accessibilityLiveRegion="polite"
            style={[s.body, { color: c.danger }]}
          >
            {formError}
          </Text>
        )}
        <Button
          title={
            saving ? "Saving…" : editing ? "Save changes" : "Add to my village"
          }
          disabled={!label.trim() || saving}
          onPress={() => {
            setSaving(true);
            setFormError("");
            void (
              editing
                ? changePerson(editing, label, category)
                : person(label, category)
            ).then((ok) => {
              setSaving(false);
              if (ok) {
                setAdding(false);
                setLabel("");
              } else
                setFormError(
                  "This support couldn’t be saved. Please try again.",
                );
            });
          }}
        />
        <Button
          title="Cancel"
          secondary
          disabled={saving}
          onPress={closeEditor}
        />
      </Sheet>
    </Screen>
  );
}
