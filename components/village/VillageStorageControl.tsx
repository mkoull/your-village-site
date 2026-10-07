"use client";
import { useVillage } from "./VillageProvider";

export default function VillageStorageControl() {
  const { ready, remembered, remember, storageMessage } = useVillage();
  if (!ready) return null;
  return (
    <div className="village-storage-control">
      <label className="village-remember-label">
        <input
          type="checkbox"
          checked={remembered}
          onChange={(event) => remember(event.target.checked)}
          aria-describedby="village-storage-description"
        />
        <span>Remember my village on this device</span>
      </label>
      <p id="village-storage-description">
        Optional. Keep choices and progress after closing the tab.
        Visible to anyone using this browser.
      </p>
      {storageMessage && <p role="status">{storageMessage}</p>}
    </div>
  );
}
