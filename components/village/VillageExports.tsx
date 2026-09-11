"use client";
import { useState } from "react";
import { useVillage } from "./VillageProvider";
import { services } from "@/content/services";
import { existingSupport } from "@/content/existing-support";
import { supportProgressOptions } from "@/lib/village";
import { SITE_URL } from "@/lib/site";

export default function VillageExports({ onPrint }: { onPrint: () => void }) {
  const { draft } = useVillage();
  const [message, setMessage] = useState("");
  const [manualCopy, setManualCopy] = useState(false);
  function planText() {
    return [
      "MY VILLAGE",
      "My support and next steps",
      "",
      ...draft.needs.flatMap((slug) => {
        const service = services.find((item) => item.slug === slug)!;
        const progress = supportProgressOptions.find(
          (item) => item.value === (draft.progress[slug] || "exploring"),
        )!.label;
        return [
          service.title,
          `My progress: ${progress}`,
          `${SITE_URL}/services/${slug}`,
          ...existingSupport
            .filter((source) => source.serviceSlug === slug)
            .map((source) => `${source.name}: ${source.href}`),
          "",
        ];
      }),
      "Progress is recorded by me. Contact each service directly to confirm suitability, availability and costs.",
    ].join("\n");
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(planText());
      setMessage("Your village has been copied.");
    } catch {
      setManualCopy(true);
      setMessage("Select and copy your village below, or download a copy.");
    }
  }
  function download() {
    const url = URL.createObjectURL(
      new Blob([planText()], { type: "text/plain;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "my-village.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage(
      "Download requested. Check your browser’s downloads for my-village.txt.",
    );
  }
  return (
    <section
      className="village-keep-copy"
      aria-labelledby="keep-village-heading"
    >
      <h2 id="keep-village-heading" className="font-heading text-2xl">
        Keep your village close.
      </h2>
      <p className="text-sm text-text-muted mt-2">
        Save a copy for later, or share it with someone in your corner.
      </p>
      <div className="village-export flex flex-wrap gap-3 mt-5">
        <button type="button" onClick={copy}>
          Copy my village
        </button>
        <button type="button" onClick={download}>
          Download my village
        </button>
        <button type="button" onClick={onPrint}>
          Print / save PDF
        </button>
      </div>
      <p role="status" className="text-sm text-text-sage mt-3">
        {message}
      </p>
      <details
        open={manualCopy}
        onToggle={(event) => setManualCopy(event.currentTarget.open)}
        className="village-next-step"
      >
        <summary>View a text copy</summary>
        <label htmlFor="village-text-copy" className="block mt-3 text-sm">
          Your village to copy
        </label>
        <textarea
          id="village-text-copy"
          readOnly
          value={planText()}
          rows={8}
          className="form-field mt-2"
          onFocus={(event) => event.currentTarget.select()}
        />
      </details>
    </section>
  );
}
