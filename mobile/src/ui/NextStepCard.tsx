import React from "react";
import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { useVillage, taskDate } from "../state/VillageContext";
import { nextSteps } from "../domain/model";
import { serviceFor } from "../domain/catalog";
import { Button } from "./Elements";
import { Icon } from "./Icon";
import { c, s } from "./theme";

export function NextStepCard() {
  const { state, complete, busy } = useVillage();
  const pending = nextSteps(state);
  const next = pending[0];
  const finished = state.tasks.filter((task) => task.done).length;
  if (!next)
    return (
      <View style={[s.card, { backgroundColor: c.sage }]}>
        <View style={s.between}>
          <Text style={s.eyebrow}>
            {finished ? "A MOMENT TO EXHALE" : "FROM SAVED TO SUPPORTED"}
          </Text>
          <Icon name={finished ? "check" : "plan"} size={21} />
        </View>
        <Text style={s.h3}>
          {finished
            ? "Look at what you’ve made room for."
            : "What would make this week easier?"}
        </Text>
        <Text style={s.body}>
          {finished
            ? `${finished} ${finished === 1 ? "small step done" : "small steps done"}. There’s no need to fill every space.`
            : "A saved idea becomes useful with one small next step."}
        </Text>
        <Button
          title={finished ? "See my plan" : "Choose a small next step"}
          secondary
          icon="arrow"
          onPress={() =>
            finished
              ? router.push("/plan")
              : router.push({
                  pathname: "/step/new",
                  params: { category: state.village.needs[0] },
                })
          }
        />
      </View>
    );
  return (
    <View style={[s.card, { backgroundColor: c.sage }]}>
      <View style={s.between}>
        <Text style={s.eyebrow}>PICK UP WHERE YOU LEFT OFF</Text>
        <Icon name={next.reminderAt ? "bell" : "plan"} size={20} />
      </View>
      <Text style={s.h3}>{next.title}</Text>
      <Text style={s.small}>
        {next.reminderAt
          ? `Reminder · ${taskDate(next)}`
          : serviceFor(next.category)?.shortTitle}
      </Text>
      <View style={[s.row, { flexWrap: "wrap" }]}>
        <View style={{ flexGrow: 1 }}>
          <Button
            title="Mark done"
            icon="check"
            disabled={busy}
            onPress={() => {
              void complete(next.id, true);
            }}
          />
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Edit next step: ${next.title}`}
          onPress={() => router.push(`/step/${next.id}`)}
          style={{
            minHeight: 48,
            paddingHorizontal: 14,
            justifyContent: "center",
          }}
        >
          <Text style={s.link}>Edit step</Text>
        </Pressable>
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push("/plan")}
        style={{ minHeight: 44, justifyContent: "center" }}
      >
        <Text style={s.link}>
          View my plan · {pending.length}{" "}
          {pending.length === 1 ? "next step" : "next steps"}
        </Text>
      </Pressable>
    </View>
  );
}
