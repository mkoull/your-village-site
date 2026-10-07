import React, { useState } from "react";
import { Text, View, Platform, Share } from "react-native";
import { useVillage } from "../../state/VillageContext";
import { shareText } from "../../domain/model";
import { services } from "../../domain/catalog";
import { Button, Screen, Sheet, openWebsite } from "../../ui/Elements";
import { Mark } from "../../ui/Icon";
import { c, s } from "../../ui/theme";
export default function Settings() {
  const { state, clear, busy, tell } = useVillage();
  const [confirmClear, setConfirmClear] = useState(false),
    [sharing, setSharing] = useState(false);
  const text = shareText(state, services);
  async function share() {
    try {
      await Share.share({ title: "My village", message: text });
    } catch {
      tell(
        "Sharing could not be opened. You can select the text below and copy it.",
      );
    }
  }
  return (
    <Screen eyebrow="MADE FOR REAL LIFE" title="Your space.">
      <View style={[s.card, { backgroundColor: c.sage }]}>
        <Mark size={44} />
        <Text style={s.h2}>
          {Platform.OS === "web"
            ? "You’re in the browser preview."
            : "A village, just for this device."}
        </Text>
        <Text style={s.body}>
          {Platform.OS === "web"
            ? "Try the app’s screens and flow here. Entries stay in memory and clear when this page reloads. Phone reminders and secure device saving require the installed app."
            : "Your choices, support labels and next steps are saved securely on this device. There’s no account, cloud sync or automatic sharing in this version."}
        </Text>
        <Text style={s.small}>
          Keep a copy of anything important. Changing phones won’t bring this
          village with you. On iPhone, secure storage may survive uninstalling;
          use Clear my village to remove it.
        </Text>
      </View>
      <View style={s.column}>
        <Text style={s.h2}>Keep someone in the loop.</Text>
        <Text style={s.body}>
          Share your selected kinds of support and recorded progress. Your
          existing-support labels and next steps stay private.
        </Text>
        <Button
          title="Preview what I’ll share"
          icon="share"
          secondary
          disabled={!state.village.needs.length}
          onPress={() => setSharing(true)}
        />
      </View>
      <View style={s.divider} />
      <Text style={s.h2}>About your village</Text>
      <Text style={s.body}>
        Support for mothers, parents and families at every stage. Explore
        independent services, bring your support together, and take the next
        step at your pace.
      </Text>
      <Text style={s.small}>
        No bookings, payments or messages are sent through this version. Prices,
        availability and arrangements are agreed directly with each service.
      </Text>
      <Button
        title="Visit the Village website"
        secondary
        icon="external"
        onPress={() => {
          void openWebsite("https://your-village-site.vercel.app/", tell);
        }}
      />
      <Button
        title="Service safety information"
        secondary
        icon="external"
        onPress={() => {
          void openWebsite("https://your-village-site.vercel.app/safety", tell);
        }}
      />
      <Text style={s.h2}>Your privacy</Text>
      <Text style={s.body}>
        This app has no advertising or analytics and uploads none of your
        village entries. Opening an external service uses that service’s website
        and privacy settings. Sharing sends only the text you approve to the app
        or person you choose.
      </Text>
      <Text style={s.small}>
        Reminders are scheduled on your phone. You can remove them in My plan or
        control permissions in your phone settings. Clearing your village
        cancels all its scheduled reminders.
      </Text>
      <Button
        title="Clear my village"
        secondary
        disabled={busy}
        onPress={() => setConfirmClear(true)}
      />
      <Text style={[s.small, { textAlign: "center" }]}>
        Your Village · 0.1.0 · Family preview
      </Text>
      <Sheet
        open={sharing}
        title="Your village to share"
        onClose={() => setSharing(false)}
      >
        <Text style={s.body}>
          This is exactly what will be included. Choose the recipient in your
          phone’s share sheet.
        </Text>
        <Text selectable style={[s.body, s.card, { color: c.ink }]}>
          {text}
        </Text>
        <Button
          title="Open sharing options"
          icon="share"
          onPress={() => {
            void share();
          }}
        />
      </Sheet>
      <Sheet
        open={confirmClear}
        title="Start with a clear village?"
        onClose={() => setConfirmClear(false)}
      >
        <Text style={s.body}>
          This removes your saved support, personal labels and all next steps
          from this device, and cancels reminders. It can’t be undone.
        </Text>
        <Button
          title={busy ? "Clearing…" : "Yes, clear my village"}
          disabled={busy}
          onPress={() => {
            void clear().then((ok) => {
              if (ok) {
                setConfirmClear(false);
                tell(
                  "Your village has been cleared. You can start fresh whenever you’re ready.",
                );
              }
            });
          }}
        />
        <Button
          secondary
          title="Keep my village"
          onPress={() => setConfirmClear(false)}
        />
      </Sheet>
    </Screen>
  );
}
