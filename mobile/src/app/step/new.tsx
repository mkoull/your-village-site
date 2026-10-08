import React from "react";
import { useLocalSearchParams } from "expo-router";
import { slugs, providerFor } from "../../domain/catalog";
import { StepEditor } from "../../ui/StepEditor";

export default function NewStep() {
  const params = useLocalSearchParams<{ category?: string }>();
  const valid =
    typeof params.category === "string" && slugs.includes(params.category);
  const category = valid ? params.category! : "food";
  return (
    <StepEditor
      initialCategory={category}
      initialTitle={
        valid ? `Explore ${providerFor(category)?.name || "support"}` : ""
      }
    />
  );
}
