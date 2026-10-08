import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useVillage } from "../../state/VillageContext";
import { Button, Screen } from "../../ui/Elements";
import { StepEditor } from "../../ui/StepEditor";

export default function EditStep() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state } = useVillage();
  const task = state.tasks.find((item) => item.id === id);
  if (!task)
    return (
      <Screen
        title="This step has moved on."
        subtitle="It may have been removed. Your other next steps are still in My plan."
      >
        <Button
          title="Back to my plan"
          onPress={() => router.replace("/plan")}
        />
      </Screen>
    );
  return <StepEditor key={task.id} task={task} />;
}
