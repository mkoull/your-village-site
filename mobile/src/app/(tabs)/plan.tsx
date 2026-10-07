import React, { useState } from "react";
import { Text, View, Pressable } from "react-native";
import { router } from "expo-router";
import { useVillage, taskDate } from "../../state/VillageContext";
import { serviceFor } from "../../domain/catalog";
import { reminderDate } from "../../domain/model";
import { Button, Chip, Screen, Sheet } from "../../ui/Elements";
import { Icon } from "../../ui/Icon";
import { c, s } from "../../ui/theme";
export default function Plan() {
  const { state, complete, removeTask, remind, busy } = useVillage();
  const [showDone, setShowDone] = useState(false),
    [reminder, setReminder] = useState<string | null>(null);
  const shown = state.tasks.filter((t) => t.done === showDone),
    pending = state.tasks.filter((t) => !t.done).length;
  return (
    <Screen
      eyebrow="ONE THING AT A TIME"
      title="A little lighter."
      subtitle="A place for small next steps. Nothing has to happen all at once."
    >
      <Button
        title="Add a next step"
        icon="plus"
        onPress={() => router.push("/step/new")}
      />
      <View style={s.wrap}>
        <Chip
          title={`Next steps · ${pending}`}
          selected={!showDone}
          onPress={() => setShowDone(false)}
        />
        <Chip
          title={`Done · ${state.tasks.length - pending}`}
          selected={showDone}
          onPress={() => setShowDone(true)}
        />
      </View>
      {shown.length === 0 && (
        <View
          style={[s.card, { backgroundColor: c.sage, paddingVertical: 30 }]}
        >
          <Icon name={showDone ? "check" : "plan"} size={30} />
          <Text style={s.h2}>
            {showDone ? "Every small step counts." : "A little breathing room."}
          </Text>
          <Text style={s.body}>
            {showDone
              ? "Your finished steps will live here."
              : "Ask about a delivery. Look into childcare. Choose one useful thing to come back to."}
          </Text>
          {!showDone && (
            <Button
              secondary
              title="Find support to explore"
              onPress={() => router.push("/explore")}
            />
          )}
        </View>
      )}
      {shown.map((item) => (
        <View key={item.id} style={s.card}>
          <View style={s.row}>
            <Pressable
              accessibilityRole="checkbox"
              accessibilityLabel={`Mark ${item.title} ${item.done ? "not done" : "done"}`}
              accessibilityState={{ checked: item.done, disabled: busy }}
              aria-checked={item.done}
              disabled={busy}
              onPress={() => {
                void complete(item.id, !item.done);
              }}
              style={{
                width: 44,
                height: 44,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  borderWidth: 1,
                  borderColor: c.forest,
                  backgroundColor: item.done ? c.forest : c.cream,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {item.done && <Icon name="check" size={17} color={c.cream} />}
              </View>
            </Pressable>
            <View style={{ flex: 1, gap: 6 }}>
              <Text
                style={[
                  s.label,
                  {
                    fontSize: 15,
                    lineHeight: 22,
                    textDecorationLine: item.done ? "line-through" : "none",
                  },
                ]}
              >
                {item.title}
              </Text>
              <Text style={s.small}>
                {serviceFor(item.category)?.shortTitle}
              </Text>
            </View>
          </View>
          {!!item.reminderAt && (
            <Text style={s.small}>Reminder time · {taskDate(item)}</Text>
          )}
          <View style={s.between}>
            {!item.done ? (
              <Pressable
                disabled={busy}
                accessibilityRole="button"
                accessibilityLabel={`Set reminder for ${item.title}`}
                onPress={() => setReminder(item.id)}
                style={[s.row, { minHeight: 44 }]}
              >
                <Icon name="bell" size={17} />
                <Text style={s.link}>
                  {item.reminderAt ? "Change reminder" : "Remind me"}
                </Text>
              </Pressable>
            ) : (
              <Text style={s.small}>A little less on your plate.</Text>
            )}
            <Pressable
              disabled={busy}
              accessibilityRole="button"
              accessibilityLabel={`Remove step ${item.title}`}
              onPress={() => {
                void removeTask(item.id);
              }}
              style={{
                minHeight: 44,
                minWidth: 44,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="close" size={17} />
            </Pressable>
          </View>
        </View>
      ))}
      <Text style={s.small}>
        These are your own next steps. Village doesn’t send requests or book a
        service when you add or complete one.
      </Text>
      <Sheet
        open={!!reminder}
        title="A gentle nudge"
        onClose={() => setReminder(null)}
      >
        <Text style={s.body}>
          Choose when your phone should remind you. The notification won’t show
          personal details.
        </Text>
        {(
          [
            ["hour", "In an hour"],
            ["tomorrow", "Tomorrow at 9 am"],
            ["week", "In a week at 9 am"],
          ] as const
        ).map(([key, label]) => (
          <Button
            key={key}
            secondary
            title={label}
            disabled={busy}
            onPress={() => {
              const id = reminder!;
              setReminder(null);
              void remind(id, reminderDate(key));
            }}
          />
        ))}
        {state.tasks.find((t) => t.id === reminder)?.notificationId && (
          <Button
            title="Remove reminder"
            secondary
            disabled={busy}
            onPress={() => {
              const id = reminder!;
              setReminder(null);
              void remind(id);
            }}
          />
        )}
      </Sheet>
    </Screen>
  );
}
