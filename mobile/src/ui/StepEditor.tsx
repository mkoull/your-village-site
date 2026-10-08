import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { useVillage, taskDate } from "../state/VillageContext";
import { services } from "../domain/catalog";
import type { Task } from "../domain/model";
import { Button, Chip, Screen } from "./Elements";
import { c, s } from "./theme";

export function StepEditor({
  task,
  initialCategory = "food",
  initialTitle = "",
}: {
  task?: Task;
  initialCategory?: string;
  initialTitle?: string;
}) {
  const [category, setCategory] = useState(task?.category ?? initialCategory);
  const [title, setTitle] = useState(task?.title ?? initialTitle);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const { state, task: addTask, changeTask, busy } = useVillage();
  const full = !task && state.tasks.length >= 25;
  const unchanged =
    !!task && title.trim() === task.title && category === task.category;
  const back = () =>
    router.canGoBack() ? router.back() : router.replace("/plan");
  return (
    <Screen
      eyebrow={task ? "YOUR PLAN, AT YOUR PACE" : "YOUR NEXT STEP"}
      title={task ? "Make it your own." : "One small thing."}
      subtitle={
        task
          ? "Adjust this step as life changes."
          : "Make a little room for something that helps."
      }
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
        returnKeyType="done"
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
      {!!task?.reminderAt && (
        <View style={[s.card, { backgroundColor: c.sage }]}>
          <Text style={s.label}>Your reminder stays set</Text>
          <Text style={s.body}>{taskDate(task)}</Text>
          <Text style={s.small}>Change the time in My plan.</Text>
        </View>
      )}
      <Text style={s.small}>
        Use a short, practical label. Leave contact details and health
        information out of your plan.
      </Text>
      {(full || error) && (
        <Text
          accessibilityLiveRegion="polite"
          style={[s.body, { color: c.danger }]}
        >
          {full
            ? "Your plan has 25 steps. Remove a finished step to make room for another."
            : error}
        </Text>
      )}
      <Button
        title={saving ? "Saving…" : task ? "Save changes" : "Add to my plan"}
        disabled={saving || busy || !title.trim() || full || unchanged}
        onPress={() => {
          setSaving(true);
          setError("");
          const save = task
            ? changeTask(task.id, title, category)
            : addTask(title, category);
          void save.then((ok) => {
            setSaving(false);
            if (ok) {
              if (task) back();
              else router.replace("/plan");
            } else setError("This step couldn’t be updated. Please try again.");
          });
        }}
      />
      <Button title="Cancel" secondary disabled={saving} onPress={back} />
    </Screen>
  );
}
